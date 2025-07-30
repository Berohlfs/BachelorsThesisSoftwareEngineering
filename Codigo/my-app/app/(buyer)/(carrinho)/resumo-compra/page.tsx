'use client'

import { useCart } from "@/contexts/CartContext"
import { CheckoutButton } from "./components/CheckoutButton"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


export default function ResumoCompra() {
  const { items, eventId } = useCart()

  if (!items.length) {
    return <div className="text-center mt-10 text-muted-foreground">Carrinho vazio.</div>
  }

 

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <>
      <p className="text-center font-extrabold mt-5 mb-5">Resumo da Compra</p>
      <p className="text-sm text-center font-semibold">Total</p>
      <h2 className="text-2xl text-center font-extrabold mb-4 text-primary">
        {total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </h2>

      <div className="flex items-center justify-center bg-background mt-10">
        <div className="max-w-xl w-[90%]">
          <div className="bg-secondary rounded-xl shadow-sm p-4">
            <Table className="text-sm">
              <TableCaption className="text-muted-foreground">
                Quase lá! Confira os produtos e finalize sua compra.
              </TableCaption>
              <TableHeader>
                <TableRow className="h-8">
                  <TableHead className="w-[150px]">Nome</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Qtd.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="h-8">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {item.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <CheckoutButton
            items={items}
            event_id={eventId}
          />
        </div>
      </div>
    </>
  )
}
