'use client';

// Libs
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
// Shadcn
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
// Validation
import { create_staff_default_values, create_staff_validation } from "@/validation/create_staff"
// Icons
import { Check, Plus } from "lucide-react"
// Actions
import { addStaff } from "./actions/addStaff"
import { getMyEvents } from "./actions/getMyEvents"
// React
import { useCallback, useEffect, useState, useTransition } from "react"
// Components
import { CircularProgress } from "@/app/components/CircularProgress"
import { debounce } from "@/utils/general/debounce";
import { Badge } from "@/components/ui/badge";

type Props = {
    user_id: string
}

export const AddStaffModal = ({ user_id }: Props) => {

    const [pending, startTransition] = useTransition()

    const [open, setOpen] = useState(false)

    const [chosen_event_id, setChosenEventId] = useState<number | null>(null)

    type Events = {
        created_at: string;
        description: string;
        id: number;
        image_bucket_ref: string | null;
        is_active: boolean | null;
        location: string;
        name: string;
        organizer_id: string;
        token: string;
    }[]

    const [my_events, setMyEvents] = useState<Events>([])

    const getMyEventsCallback = async (search: string) => {
        const res = await getMyEvents(user_id, search)
        if (typeof res === 'string') {
            toast.warning(res)
        } else {
            setMyEvents(res)
        }
    }

    const deboucedGetMyEvents = useCallback(debounce(getMyEventsCallback, 800), [])

    const form = useForm<z.infer<typeof create_staff_validation>>({
        resolver: zodResolver(create_staff_validation),
        defaultValues: create_staff_default_values
    })

    function onSubmit(data: z.infer<typeof create_staff_validation>) {
        if (!chosen_event_id) {
            return toast.warning('Para criar um novo acesso, é preciso escolher um evento.')
        }
        startTransition(() => {
            const res = addStaff(data, chosen_event_id).then(res => {
                setChosenEventId(null)
                if (res) {
                    toast.warning(res)
                } else {
                    form.reset()
                }
            })
        })
    }

    useEffect(() => {
        if (!pending) {
            setOpen(false)
        }
    }, [pending])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={'sm'} variant={'outline'}>
                    Novo <Plus />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Novo Acesso de Funcionário</DialogTitle>
                    <DialogDescription>
                        Preencha os dados obrigatórios do formulário abaixo
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name={'full_name'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome completo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite o nome completo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'username'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do usuário (login)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Digite o nome do usuário (login)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'password'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chave de Acesso</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Digite a chave de acesso" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <p className={'font-medium text-sm text-center'}>Este acesso será para qual evento?</p>
                        <div className={'h-24 border rounded-md p-3'}>
                            <Input
                                onChange={(e) => deboucedGetMyEvents(e.target.value)}
                                placeholder="Buscar evento pelo nome"
                            />
                            <div className={'flex items-center gap-2 pt-3 pl-1'}>
                                {my_events.map(event => (
                                    <Badge
                                        onClick={() => setChosenEventId(event.id)}
                                        className={`cursor-pointer ${chosen_event_id === event.id ? 'bg-green-700 text-white' : ''}`}
                                        variant={'secondary'}
                                        key={event.id}>
                                        {event.name}
                                        {chosen_event_id === event.id && <Check />}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={pending}
                            className={'w-full'}>
                            {pending ?
                                <CircularProgress />
                                :
                                <>
                                    Criar <Plus />
                                </>}

                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    )
}