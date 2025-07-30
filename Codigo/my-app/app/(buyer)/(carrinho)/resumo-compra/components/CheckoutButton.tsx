// components/CheckoutButton.tsx
'use client'

import { Button } from '@/components/ui/button'
import { createCheckoutSession } from './actions/createCheckoutSession'

import { createOrder } from './actions/createOrder'
import { CircularProgress } from '@/app/components/CircularProgress'
import { useState } from 'react'
import { WalletIcon } from 'lucide-react'

import { toast } from 'sonner'

type Item = {
  name: string
  price: number
  quantity: number
  img_ref?: string
  event_product_id: number
}


export function CheckoutButton({ items, event_id }: { items: Item[]; event_id: number | null }) {

  const [loading, setLoading] = useState(false)
  const handleClick = async () => {
    setLoading(true)
    if (!event_id) {

      alert('Evento inválido.')
      return
    }

    try {
      const result = await createOrder(event_id, items)
      if (result.error) {
        toast.error(result.error)
        setLoading(false)
        return
      }
      const { user_id, order_id } = result as { user_id: string; order_id: number }
      const response = await createCheckoutSession(items, user_id, order_id)
      if (response?.url) {
        window.location.href = response.url
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      toast.warning('Erro ao criar pedido ou iniciar checkout. Por favor tente novamente mais tarde.')
      setLoading(false)
    }
  }

  return (
    <Button className="w-full mt-5" onClick={handleClick}>

      Pagar
      {loading ? <CircularProgress /> : <WalletIcon />}
    </Button>
  )
}