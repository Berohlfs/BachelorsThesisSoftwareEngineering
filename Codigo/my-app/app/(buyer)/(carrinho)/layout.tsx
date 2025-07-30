import { CartProvider } from '@/contexts/CartContext'

export default function ComprasLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}
