'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation';

import { createClient } from "@/utils/supabase/client"
import { QrCodeButton } from '../../../components/QrCodeButton'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import GenericLoading from '@/app/components/GenericLoading'
import { getOrderByToken } from './components/actions/getOrderByToken'
import { RealtimeChannel } from '@supabase/supabase-js';
import { Tables } from '@/utils/supabase/supabase-types';
import { Badge } from '@/components/ui/badge';

type Order = Tables<'orders'> & {
    order_items: Tables<'order_items'>[];
};


export default function SuccessPage() {

    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState<Order | null>(null)
    const params = useParams();
    const rawToken = params?.token;
    const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

    const channelRef = useRef<RealtimeChannel | null>(null)


    useEffect(() => {
        if (!token) return;

        const supabase = createClient();
        let isMounted = true;

        const fetchOrder = async () => {

            const result = await getOrderByToken(token);

            if (!isMounted) return;

            if (result.status === 'paid') {
                setOrder(result.order);
                setLoading(false);

                // ✅ Prevent duplicate subscription
                if (!channelRef.current) {
                    const channel = supabase.channel(`order-items-${result?.order?.id}`);

                    channel
                        .on(
                            'postgres_changes',
                            {
                                event: 'UPDATE',
                                schema: 'public',
                                table: 'order_items',
                                filter: `order_id=eq.${result?.order?.id}`,
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

                    channelRef.current = channel;
                }
            } else if (result.status === 'pending') {
                //TODO: redirecionar para pagina de pagamento ??? Stripe??? Ou só mensagem de não existe, não pago
            }
        };

        fetchOrder();

        return () => {
            isMounted = false;
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, [token]);



    if (loading) {
        return <GenericLoading />
    }

    if (!order) {
        return <p className="text-center mt-10 text-red-500"> Erro ao carregar o pedido.</p>
    }

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-5 text-center">Detalhes da compra</h1>
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
            <p className="text-muted-foreground text-sm text-center mt-5">Compra realizada em {new Date(order.created_at).toLocaleDateString()} às {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
    )
}
