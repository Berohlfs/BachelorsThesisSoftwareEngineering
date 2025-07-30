'use client'

// Shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { createClient } from "@/utils/supabase/client"
// Libs
import dayjs from "dayjs"
import { User } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type Order = {
    id: number;
    total: number | null;
    created_at: string;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

type Props = {
    orders: Order[]
    event_ids: number[]
}

export function OrdersTable({ orders, event_ids }: Props) {

    const [orders_state, setOrdersState] = useState(orders)

    function playChime(baseFreq = 440, noteDuration = 150, volume = 0.1) {
        const context = new AudioContext();

        const notes = [
            baseFreq,               // tonic (e.g., A4 = 440Hz)
            baseFreq * 1.25,        // major third (e.g., C#5 = 550Hz)
            baseFreq * 2,           // octave (e.g., A5 = 880Hz)
        ];

        notes.forEach((freq, i) => {
            const oscillator = context.createOscillator();
            const gain = context.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = freq;

            gain.gain.value = volume;

            oscillator.connect(gain);
            gain.connect(context.destination);

            const startTime = context.currentTime + i * (noteDuration / 1000);
            const stopTime = startTime + noteDuration / 1000;

            oscillator.start(startTime);
            oscillator.stop(stopTime);
        });
    }

    useEffect(() => {
        const supabase = createClient()

        const channels = event_ids.map((id) =>
            supabase
                .channel(`orders:${id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'orders',
                        filter: `event_id=eq.${id}`,
                    },
                    async (payload) => {
                        if (payload.new.status === 'paid') {
                            console.log(`New order for event ${id}:`, payload)
                            const { data } = await supabase
                                .from('orders')
                                .select(`
                                    id,
                                    total,
                                    created_at,
                                    profiles (
                                        full_name,
                                        avatar_url
                                    )
                                `)
                                .eq('id', payload.new.id)
                                .single()
                            console.log(data)
                            setOrdersState(prev => {
                                if (data) {
                                    const newList = [data as unknown as Order, ...prev.slice(0, prev.length - 1)];
                                    return newList;
                                }
                                return prev;
                            })
                            playChime()
                            toast.success(`Nova compra realizada por ${(data as unknown as Order)?.profiles?.full_name} no valor de ${data?.total.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}!`)
                        }
                    }
                )
                .subscribe()
        )

        return () => {
            // ✅ Cleanup all channels
            channels.forEach((ch) => {
                supabase.removeChannel(ch)
            })
        }
    }, [event_ids])

    return (
        <Card className="flex w-full flex-col gap-4">
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={'w-10'}></TableHead>
                            <TableHead>Consumidor</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Horário</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="**:data-[slot=table-cell]:py-2.5">
                        {orders_state && orders_state.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">
                                    <Avatar>
                                        <AvatarImage src={order.profiles?.avatar_url || ''} />
                                        <AvatarFallback>
                                            <User size={16} />
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {order.profiles?.full_name}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={"bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100"}
                                    >
                                        {(order.total || 0).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        })}
                                    </Badge>
                                </TableCell>
                                <TableCell>{dayjs(order.created_at).format('DD/MM/YYYY [às] HH:mm')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
