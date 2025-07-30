'use server'

import { createClient } from '@/utils/supabase/server'

type Item = {
    name: string
    price: number
    quantity: number
    img_ref?: string
    event_product_id: number
}

export async function createOrder(event_id: number, items: Item[]) {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error('User not authenticated')
    }
    const user_id = user.id
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

    // Validar estoque 
    for (const item of items) {
        if (!item.event_product_id) {
            throw new Error('Sem event_product_id')
        }

        const { data: eventProduct, error: stockError } = await supabase
            .from('events_products')
            .select('stock')
            .eq('id', item.event_product_id)
            .single()

        if (stockError || !eventProduct) {
            console.error('Failed to fetch stock for item:', item)
            throw new Error('Erro ao verificar estoque')
        }

        if (eventProduct.stock < item.quantity) {
           return { error: `Estoque insuficiente para a quantidade de ${item.name} que você deseja comprar.` }
        }
    }

    const { data: order, error } = await supabase
        .from('orders')
        .insert({
            client_id: user_id,
            event_id: event_id,
            total,
            status: 'pending',
        })
        .select()
        .single()

    if (error || !order) {
        console.error('Insert order error:', error)

        throw new Error('Failed to create order')


    }

    // Iserir itens do pedido
    const { error: itemError } = await supabase
        .from('order_items')
        .insert(
            items.flatMap((item) =>
                Array.from({ length: item.quantity }).map(() => ({
                    order_id: order.id,
                    name: item.name,
                    price: item.price,
                    image_bucket_ref: item.img_ref || null,
                }))
            )
        )



    if (itemError) {
        console.error('Insert order items error:', itemError)

        throw new Error('Falha ao criar itens do pedido')
    }

    for (const item of items) {
        const { error: rpcError } = await supabase.rpc('decrement_stock_by_event_product_id', {
            event_product_id: item.event_product_id,
            amount: item.quantity,
        })

        if (rpcError) {
            console.error('Stock decrement error:', rpcError)
            throw new Error(`Erro ao atualizar estoque de ${item.name}`)
        }
    }

    return {
        order_id: order.id,
        user_id: user_id,
    }
}
