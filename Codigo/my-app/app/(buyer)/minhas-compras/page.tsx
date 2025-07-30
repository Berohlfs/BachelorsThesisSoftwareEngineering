import { createClient } from '@/utils/supabase/server'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { PaginationControls } from '@/app/components/Pagination'

export const metadata: Metadata = {
    title: 'Minhas Compras',
}

type Props = {
    searchParams: Promise<{
        page: string
    }>
}

export default async function MinhasCompras({ searchParams }: Props) {

    const supabase = await createClient()

    const { page } = await searchParams

    const parsed_page = parseInt(page || "1")
    const limit = 5
    const offset = (parsed_page - 1) * limit

    const { data: user } = await supabase.auth.getUser()

    const { data: orders } = await supabase
        .from('orders')
        .select(`
            *,
            event: events (
                name
            ),
            order_items(
                name,
                price
            )
        `)
        .eq('client_id', user.user?.id || '')
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    const { count } = await supabase
        .from('orders')
        .select('id', { count: 'exact' })
        .eq('client_id', user.user?.id || '').eq('status', 'paid').order('created_at', { ascending: false })

    console.log('orders', orders)
    if (!orders) {
        return <p className="text-center text-muted-foreground">Nenhuma compra encontrada.</p>
    }

    return (<>
        <section className="p-5">
            <div className={'flex justify-between gap-2 items-center mb-3'}>
                <h2 className="font-extrabold text-lg">Minhas Compras</h2>
                <PaginationControls
                    total_items={count || 0}
                    current_page={parsed_page}
                    items_per_page={limit} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {orders.map((order) => {
                    const produtos = order.order_items
                        .map((item) => item.name)
                        .filter(Boolean)
                        .join(', ')

                    return (
                        <Link key={order.id} href={`/compra/${order.token}`}>
                            <article className="border p-3 rounded-md flex flex-col gap-3 hover:scale-102">

                                <div>
                                    <p className="font-bold text-sm">{order.event?.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {order.created_at
                                            ? new Date(order.created_at).toLocaleDateString('pt-BR')
                                            : 'Data indefinida'}
                                    </p>
                                </div>

                                <p className="text-sm truncate whitespace-nowrap overflow-hidden">
                                    {produtos || 'Sem produtos'}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold">Total da compra</p>
                                        <p className="font-extrabold text-primary">
                                            {(order.total)?.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            })}
                                        </p>
                                    </div>

                                    <Button size="icon" className="rounded-full">
                                        <ArrowRight />
                                    </Button>
                                </div>
                            </article>
                        </Link>
                    )
                })}
            </div>

        </section>
    </>)
}
