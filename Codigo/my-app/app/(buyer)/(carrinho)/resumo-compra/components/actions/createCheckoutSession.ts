'use server'

import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

type CheckoutItem = {
  name: string
  price: number
  quantity: number
}

export async function createCheckoutSession(items: CheckoutItem[], user_id: string, order_id: number) {

  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  const userEmail = user?.email
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map(item => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, //centavos
        },
        quantity: item.quantity,
      })),
      metadata: {
        user_id,
        order_id
      },
      customer_email: userEmail,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/sucesso-compra?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancelar`,
    })

    return { url: session.url }
  } catch (error) {
    console.error('[STRIPE ERROR]', error)
    throw new Error('Erro ao criar a sessão de checkout')
  }
}
