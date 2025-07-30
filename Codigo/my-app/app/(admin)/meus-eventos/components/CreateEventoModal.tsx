'use client';

// Libs
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Plus } from "lucide-react"

// Validation
import {
    create_evento_default_values,
    create_evento_validation,
} from "@/validation/create_evento"

// Actions
import { createEvento } from "./actions/createEvento"

// React
import { useEffect, useState, useTransition } from "react"

// Components
import { CircularProgress } from "@/app/components/CircularProgress"
import { cn } from "@/lib/utils"

export const CreateEventoModal = () => {
    const [pending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof create_evento_validation>>({
        resolver: zodResolver(create_evento_validation),
        defaultValues: create_evento_default_values,
    })

    function onSubmit(data: z.infer<typeof create_evento_validation>) {
        const { datetime_start, datetime_end, time_start, time_end } = data

        if (!datetime_start || !datetime_end || !time_start || !time_end) {
            return toast.error("Preencha todos os campos de data e hora.")
        }

        const datetimeStartFull = new Date(`${datetime_start.toDateString()} ${time_start}`)
        const datetimeEndFull = new Date(`${datetime_end.toDateString()} ${time_end}`)

        if (datetimeEndFull <= datetimeStartFull) {
            return toast.error("A data e hora de término devem ser após o início.")
        }

        startTransition(async () => {
            const res = await createEvento({
                ...data,
                datetime_start: datetimeStartFull,
                datetime_end: datetimeEndFull,
            })
            if (res) toast.warning(res)
        })
    }

    useEffect(() => {
        if (!pending) setOpen(false)
    }, [pending])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={'sm'} variant={'outline'}>
                    Novo <Plus />
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-fit">
                <DialogHeader>
                    <DialogTitle>Criar Novo Evento</DialogTitle>
                    <DialogDescription>
                        Preencha os dados obrigatórios do formulário abaixo
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name={'name'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do evento</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite o nome do evento" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'description'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição do evento</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite a descrição do evento" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'location'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Local do evento</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite o endereço do evento" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex ">


                            <FormField
                                control={form.control}
                                name="datetime_start"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col flex-1 mr-2">
                                        <FormLabel>Data de Início</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? format(field.value, "PPP")
                                                            : "Selecionar data"}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="time_start"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hora de Início</FormLabel>
                                        <FormControl>
                                            <Input type="time" step="1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        <div className="flex ">


                            <FormField
                                control={form.control}
                                name="datetime_end"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col flex-1 mr-2">
                                        <FormLabel>Data de Fim</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            " pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? format(field.value, "PPP")
                                                            : "Selecionar data"}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="time_end"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hora de Término</FormLabel>
                                        <FormControl>
                                            <Input type="time" step="1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
