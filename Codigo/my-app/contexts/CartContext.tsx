'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  img_ref?: string
  event_product_id: number
}

type CartContextType = {
  items: CartItem[]
  eventId: number | null
  addItem: (item: CartItem, eventId: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [eventId, setEventId] = useState<number | null>(null)

  const addItem = (item: CartItem, newEventId: number) => {
    setEventId(newEventId)
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, item]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ).filter((item) => item.quantity > 0)
    )
  }

  const clearCart = () => {
    setItems([])
    setEventId(null)
  }

  return (
    <CartContext.Provider value={{ items, eventId, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
