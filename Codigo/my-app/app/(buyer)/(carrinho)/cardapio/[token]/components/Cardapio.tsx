'use client'

import { useCart } from '@/contexts/CartContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { QRCodeModal } from '@/app/(admin)/meus-eventos/[token]/components/QRCodeModal'
import { CircularProgress } from '@/app/components/CircularProgress'
import { useTransition } from 'react'
type Product = {
    id: string
    name: string
    description: string
    category: string
    price: number
    imageUrl: string | undefined
    img_ref?: string
    event_product_id: number

}

type Props = {
    comidas: Product[]
    bebidas: Product[]
    imageUrl?: string
    eventId: number
    token: string
}
export default function CardapioClient({ comidas, bebidas, imageUrl, eventId, token }: Props) {
    const { items, addItem, updateQuantity } = useCart()
    const router = useRouter()

    const [pending, startTransition] = useTransition()

    const getQuantity = (id: string) => {
        return items.find(item => item.id === id)?.quantity || 0
    }

    const handleAdd = (product: Product) => {
        const current = getQuantity(product.id)
        if (current === 0) {
            addItem(
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    img_ref: product.img_ref,
                    event_product_id: product.event_product_id
                },
                eventId
            )
        } else {
            updateQuantity(product.id, current + 1)
        }
    }

    const handleRemove = (id: string) => {
        const current = getQuantity(id)
        if (current > 0) updateQuantity(id, current - 1)
    }

    const renderProduct = (product: Product) => (
        <div className="p-3 border rounded-md flex items-center" key={product.id}>
            <img
                className="max-h-20 max-w-20 rounded-md mr-4"
                src={product.imageUrl}
                alt={product.name}
            />
            <div className="flex-1">
                <p className="font-bold text-sm mb-1">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.description}</p>
                <div className="flex items-center justify-between gap-2 mt-3">
                    <p className="font-bold text-primary">R${product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="secondary" onClick={() => handleRemove(product.id)}>
                            <Minus />
                        </Button>
                        <p>{getQuantity(product.id)}</p>
                        <Button size="icon" variant="secondary" onClick={() => handleAdd(product)}>
                            <Plus />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <section>
            <div
                style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
                className="w-full h-32 sm:h-40 md:h-44 bg-repeat-x bg-top bg-contain relative"
            >
                <div className={'absolute top-3 right-3'}>
                    <QRCodeModal
                        cardapio_token={token} />
                </div>

            </div>

            <Tabs defaultValue="bebidas" className="w-[90%] max-w-[500px] mx-auto my-2">
                <TabsList className="w-full justify-evenly">
                    <TabsTrigger value="bebidas" className="flex-1">Bebidas</TabsTrigger>
                    <TabsTrigger value="comidas" className="flex-1">Comidas</TabsTrigger>
                </TabsList>

                <TabsContent value="bebidas">
                    <div className="flex flex-col gap-3 pb-20">
                        {bebidas.map(renderProduct)}
                    </div>
                </TabsContent>

                <TabsContent value="comidas">
                    <div className="flex flex-col gap-3 pb-20">
                        {comidas.map(renderProduct)}
                    </div>
                </TabsContent>
            </Tabs>

            {items.length > 0 && (
                <div className="w-[90%] max-w-[500px] fixed bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={() => {
                            startTransition(() => {
                                router.push('/resumo-compra')
                            })
                            }
                        }>
                    Finalizar compra ({items.reduce((acc, i) => acc + i.quantity, 0)})
                    {pending ?
                        <CircularProgress /> : <ShoppingCart className="ml-2 h-5 w-5" />}
                </Button>
                </div>
    )
}
        </section >
    )
}
