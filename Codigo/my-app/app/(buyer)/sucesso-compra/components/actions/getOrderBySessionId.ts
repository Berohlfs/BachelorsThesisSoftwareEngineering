'use server'

import Stripe from 'stripe'
import { createClient } from "@/utils/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function getOrderBySessionId(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const orderId = Number(session.metadata?.order_id)

    if (!orderId) return { status: 'error', message: 'ID inválido', order: null }

    const supabase = await createClient()
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
         *
        )
      `)
      .eq('id', orderId)
      .single()

    if (error || !order) return { status: 'error', message: 'Pedido não encontrado', order }


    if (order) {
      order.order_items.sort((a, b) => {
        const nameA = a.name ?? ''
        const nameB = b.name ?? ''
        return nameA.localeCompare(nameB)
      })

    }

    return { status: order.status, order }
  } catch (err) {
    console.error('[getOrderBySessionId]', err)
    return { status: 'error', message: 'Erro interno', order: null}
  }
}
