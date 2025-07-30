"use client"

// Libs
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
// Shadcn
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CalendarIcon, Check, Edit, X } from "lucide-react"
// Validation
import { update_evento_validation } from "@/validation/update_evento"
// Actions
import { updateEvento } from "./actions/updateEvento"
// React
import { useEffect, useState, useTransition } from "react"
// Components
import { CircularProgress } from "@/app/components/CircularProgress"
import { QRCodeModal } from "./QRCodeModal"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type Props = {
    default_values: z.infer<typeof update_evento_validation>,
    token: string
}

export const EventoForm = ({ default_values, token }: Props) => {

    const [disabled, setDisabled] = useState(true)

    const [pending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof update_evento_validation>>({
        resolver: zodResolver(update_evento_validation),
        defaultValues: default_values
    })

    const createIncendioCallback = async (data: z.infer<typeof update_evento_validation>) => {
        const datetimeStartFull = new Date(`${data.datetime_start?.toDateString()} ${data.time_start}`)
        const datetimeEndFull = new Date(`${data.datetime_end?.toDateString()} ${data.time_end}`)


        if (datetimeEndFull <= datetimeStartFull) {
            return toast.error("A data e hora de término devem ser após o início.")
        }

        startTransition(() => {
            updateEvento({
                ...data,
                datetime_start: datetimeStartFull,
                datetime_end: datetimeEndFull,
            }, token).then(res => {
                if (res) {
                    toast.warning(res)
                } else {
                    setDisabled(true)
                }
            })
        })

    }

    useEffect(() => {
        form.reset(default_values)
    }, [default_values])


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => createIncendioCallback(data))}>

                <div className={'flex justify-end items-center gap-2 my-3'}>
                    {disabled &&
                        <QRCodeModal
                            large={true}
                            cardapio_token={token} />}
                    {disabled ?
                        <Button
                            onClick={() => setDisabled(false)}
                            type={'button'}
                            size={'sm'}
                            variant={'outline'}>
                            Editar
                            <Edit />
                        </Button> :
                        <>
                            <Button
                                type={'button'}
                                onClick={() => { setDisabled(true); form.reset() }}
                                size={'sm'}
                                variant={'outline'}>
                                Cancelar
                                <X />
                            </Button>
                            <Button type="submit" size={'sm'} disabled={pending}>
                                {pending ?
                                    <CircularProgress /> :
                                    <>
                                        Salvar
                                        <Check />
                                    </>}
                            </Button>
                        </>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1">
                        <FormField
                            control={form.control}
                            name={'name'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do evento</FormLabel>
                                    <FormControl>
                                        <Input placeholder={`Digite o nome do evento`} {...field} disabled={disabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3">
                        <FormField
                            control={form.control}
                            name={'location'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Local do evento</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite o local do evento" {...field} disabled={disabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                        <FormField
                            control={form.control}
                            name={'description'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição do evento</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={`Digite a descrição do evento`}
                                            {...field}
                                            disabled={disabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-1">
                        <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                            <FormField
                                control={form.control}
                                name="datetime_start"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Data de Início</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                        disabled={disabled}
                                                    >
                                                        {field.value
                                                            ? format(field.value, "dd/MM/yyyy")
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
                                    <FormItem className="flex-1">
                                        <FormLabel>Hora de Início</FormLabel>
                                        <FormControl>
                                            <Input type="time" step="1" className="w-full" {...field} disabled={disabled} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>


                    <div className="col-span-1">
                        <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                            <FormField
                                control={form.control}
                                name="datetime_end"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Data de Fim</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        disabled={disabled}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? format(field.value, "dd/MM/yyyy")
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
                                    <FormItem className="flex-1">
                                        <FormLabel>Hora de Término</FormLabel>
                                        <FormControl>
                                            <Input type="time" step="1" className="w-full" {...field} disabled={disabled} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                </div>
            </form>
        </Form>
    )
}