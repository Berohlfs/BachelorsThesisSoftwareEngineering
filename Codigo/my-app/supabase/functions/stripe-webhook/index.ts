// supabase/functions/stripe-webhook/index.ts
import { serve } from 'https://deno.land/std@0.200.0/http/server.ts'

import Stripe from 'https://esm.sh/stripe@14.11.0?target=denonext'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-11-20',
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  if (!signature) {
    return new Response('Missing Stripe signature', { status: 400 })
  }

  const body = await req.text()

  let event: Stripe.Event

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    console.error('❌ Invalid Stripe signature:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderIdRaw = session.metadata?.order_id

    const orderId = orderIdRaw && !isNaN(Number(orderIdRaw))
      ? parseInt(orderIdRaw)
      : null

    if (!orderId) {
      return new Response('Invalid or missing order_id', { status: 400 })
    }

    // ✅ Update the order status to "paid"
    const updateRes = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/rest/v1/orders?id=eq.${orderId}`,
      {
        method: 'PATCH',
        headers: {
          apikey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
          Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ status: 'paid' }),
      }
    )

    if (!updateRes.ok) {
      console.error('❌ Failed to update order status')
      return new Response('Error updating order', { status: 500 })
    }

    console.log(`✅ Order ${orderId} marked as paid`)
  }

  return new Response('OK', { status: 200 })
})
