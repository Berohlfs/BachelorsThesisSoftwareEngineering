'use server'

import { createClient } from "@/utils/supabase/server"

export async function getOrderByToken(token: string) {
  try {
  
    if (!token) return { status: 'error', message: 'Token inválido', order: null }

    const supabase = await createClient()
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *
        )
      `)
      .eq('token', token)
      .single()

    if (error || !order) return { status: 'error', message: 'Pedido não encontrado', order: null }


    if (order) {
      order.order_items.sort((a, b) => {
        const nameA = a.name ?? ''
        const nameB = b.name ?? ''
        return nameA.localeCompare(nameB)
      })

    }

    return { status: order.status, order }
  } catch (err) {
    console.error('[getOrderByToken]', err)
    return { status: 'error', message: 'Erro interno', order: null}
  }
}
