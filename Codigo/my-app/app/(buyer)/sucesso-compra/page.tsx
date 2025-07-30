'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getOrderBySessionId } from './components/actions/getOrderBySessionId'
import { createClient } from "@/utils/supabase/client"
import { CircularProgress } from '@/app/components/CircularProgress'
import { QrCodeButton } from '../../components/QrCodeButton'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { Tables } from '@/utils/supabase/supabase-types'
import { Badge } from '@/components/ui/badge'
type Order = Tables<'orders'> & {
    order_items: Tables<'order_items'>[];
};

export default function SuccessPage() {



    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState<Order | null>(null)

    useEffect(() => {
        if (!sessionId) return

        const fetchOrder = async () => {
            const result = await getOrderBySessionId(sessionId)

            if (result.status === 'paid') {
                setOrder(result.order)
                setLoading(false)

                const supabase = createClient();
                const channel = supabase.channel(`order-items-${result.order?.id}`);

                channel
                    .on(
                        'postgres_changes',
                        {
                            event: 'UPDATE',
                            schema: 'public',
                            table: 'order_items',
                            filter: `order_id=eq.${result.order?.id}`,
                        },
                        (payload) => {
                            const updatedItem = payload.new;

                            setOrder((prev) => {
                                if (!prev) return prev;

                                const updatedItems = prev.order_items.map((item) =>
                                    item.id === updatedItem.id
                                        ? { ...item, redeemed_at: updatedItem.redeemed_at }
                                        : item
                                );

                                return { ...prev, order_items: updatedItems };
                            });
                        }
                    )
                    .subscribe();

                return () => {
                    supabase.removeChannel(channel);
                };
            } else if (result.status === 'pending') {

                const supabase = createClient()
                const channel = supabase
                    .channel(`order-status-${result.order?.id}`)
                    .on(
                        'postgres_changes',
                        {
                            event: 'UPDATE',
                            schema: 'public',
                            table: 'orders',
                            filter: `id=eq.${result.order?.id}`,
                        },
                        (payload) => {
                            if (payload.new.status === 'paid') {
                                setOrder({
                                    ...(result.order as Order),
                                    status: 'paid',
                                })
                                setLoading(false)
                            }
                        }
                    )
                    .subscribe()

                return () => {
                    supabase.removeChannel(channel)
                }
            } else {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [sessionId])

    if (loading) {
        return <section className={'h-[calc(100vh-100px)] w-full flex items-center justify-center'}>
            <div className={'flex flex-col justify-center items-center gap-4'}>
                <CircularProgress dark />
                <p className={'text-xs'}>Aguardando confirmação do pagamento...</p>
            </div>
        </section>
    }

    if (!order) {
        return <p className="text-center mt-10 text-red-500"> Erro ao carregar o pedido.</p>
    }

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Compra confirmada!</h1>
            <p className="text-sm text-center font-semibold mt-1">Total</p>
            <h2 className="text-2xl text-center font-extrabold mb-4 text-primary">
                {(order.total)?.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })}
            </h2>

            <div className="space-y-4">
                {order.order_items.map((item) => (
                    <div key={item.id} className={'shadow p-3 rounded-md flex flex-col gap-3'}>
                        <div className={'flex items-center justify-between'}>
                            <div>
                                <p className="font-semibold">{item.name}</p>




                            </div>
                            <AnimatePresence mode="wait">
                                {!item.redeemed_at ? (
                                    <motion.div
                                        key="qr"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                    >
                                        <QrCodeButton qr_code_token={item.qr_code_token} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="redeemed"
                                        initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="h-9 p-2 flex flex-col items-center justify-center text-green-500"
                                        title={`Retirado em ${new Date(item.redeemed_at).toLocaleDateString()} às ${new Date(item.redeemed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                    >
                                        <small className='text-xs mb-1 leading-none font-medium mr-1' >Retirado em </small>
                                        <Badge className='bg-green-600 text-white' variant="default">{new Date(item.redeemed_at).toLocaleDateString()} às {new Date(item.redeemed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<Check color='white' size={20} /></Badge>
                                        
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    </div>

                ))}
            </div>
        </div>
    )
}
