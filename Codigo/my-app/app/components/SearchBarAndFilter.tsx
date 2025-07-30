'use client'

// Shadcn
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
// Icons
import { Eraser, Filter, CalendarIcon } from "lucide-react"
// React
import { useCallback, useEffect, useState, useTransition } from "react"
// Validation
import { filters_validation, filters_default_values } from "@/validation/filters"
// Libs
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import dayjs from "dayjs"
// Components
import { CircularProgress } from "@/app/components/CircularProgress"
// Utils
import { debounce } from "@/utils/general/debounce"
// Next
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"


type Props = {
    selected_filters: (keyof z.infer<typeof filters_validation>)[]
    intervalo_label_inicio?: string
    intervalo_label_fim?: string
    label_search_bar?: string
}

export const SearchBarAndFilter = ({ selected_filters, intervalo_label_inicio = 'Início', intervalo_label_fim = 'Fim', label_search_bar = 'Buscar' }: Props) => {

    const [search, setSearch] = useState<string>('')

    const [pending, startTransition] = useTransition()

    const [filters_open, setFiltersOpen] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()

    const filter = (data: z.infer<typeof filters_validation>) => {
        const filters: { [key: string]: string | undefined } = {
            ...((selected_filters.includes('ocorrencia') && data.ocorrencia) ? { ocorrencia: data.ocorrencia } : undefined),
            ...((selected_filters.includes('tipo') && data.tipo) ? { tipo: data.tipo } : undefined),
            ...((selected_filters.includes('inicio') && data.inicio) ? { inicio: data.inicio.toDateString() } : undefined),
            ...((selected_filters.includes('fim') && data.fim) ? { fim: data.fim.toDateString() } : undefined),
        }

        const current_params = new URLSearchParams()

        for (const key of Object.keys(filters)) {
            current_params.set(key, String(filters[key]))
        }

        startTransition(() => {
            router.push(`?${current_params.toString()}`)
            setFiltersOpen(false)
        })
    }

    const debouncedSearch = useCallback(debounce((search: string) => {
        const current_params = new URLSearchParams(searchParams.toString())
        if (search) {
            current_params.set('search', search)
        } else {
            current_params.delete('search')
        }
        router.push(`?${current_params.toString()}`)
    }, 1000), [searchParams])

    const form = useForm<z.infer<typeof filters_validation>>({
        resolver: zodResolver(filters_validation),
        defaultValues: filters_default_values
    })

    const cleanUp = () => {
        router.push('?')
        form.setValue('inicio', null)
        form.setValue('fim', null)
        form.setValue('ocorrencia', '')
        form.setValue('tipo', '')
        setSearch('')
    }

    useEffect(() => {
        const current_params = new URLSearchParams(searchParams.toString())
        for (const key of Object.keys(filters_validation.shape) as (keyof z.infer<typeof filters_validation>)[]) {
            const value = current_params.get(key)
            if (value) {
                if ((['inicio', 'fim'] as (keyof z.infer<typeof filters_validation>)[]).includes(key)) {
                    if (dayjs(value).isValid()) {
                        form.setValue(key as keyof z.infer<typeof filters_validation>, new Date(value))
                    }
                } else {
                    form.setValue(key as keyof z.infer<typeof filters_validation>, value)
                }
            }
        }
        if (current_params.has('search')) {
            setSearch(current_params.get('search') || '')
        }
    }, [])

    return (
        <section className={'flex gap-2 items-center justify-end flex-1 my-4'}>
            <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); debouncedSearch(e.target.value) }}
                placeholder={label_search_bar}
                className={'h-8 flex-1'} />

            <div className={'flex gap-2'}>
                {searchParams.toString() &&
                    <Button
                        variant={'ghost'}
                        onClick={cleanUp}
                        size={'sm'}>
                        Limpar
                        <Eraser />
                    </Button>}

                <Dialog open={filters_open} onOpenChange={setFiltersOpen}>
                    <DialogTrigger asChild>
                        <Button size={'sm'} variant={'ghost'}>
                            Filtrar
                            <Filter />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className={'min-w-[90%]'}>
                        <DialogHeader>
                            <DialogTitle>Filtros</DialogTitle>
                            <DialogDescription>
                                Aplique os filtros desejados.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit((data) => filter(data))}>
                                <div className={'flex justify-between items-center gap-2 mb-3'}>
                                    <div></div>
                                    <Button type="submit" size={'sm'} disabled={pending}>
                                        {pending ?
                                            <CircularProgress /> :
                                            <>
                                                Aplicar filtros
                                                <Filter />
                                            </>}
                                    </Button>
                                </div>
                                <section className={'h-[calc(var(--vh,1vh)*100-250px)] overflow-y-scroll px-1'}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                                        {selected_filters.includes('inicio') &&
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name={'inicio'}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>{intervalo_label_inicio}</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                format(field.value, "dd/MM/yyyy")
                                                                            ) : (
                                                                                <span>Escolha uma data</span>
                                                                            )}
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value || undefined}
                                                                        onSelect={field.onChange}
                                                                        disabled={(date) => date < new Date("2000-01-01")}
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>}
                                        {selected_filters.includes('fim') &&
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name={'fim'}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>{intervalo_label_fim}</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                format(field.value, "dd/MM/yyyy")
                                                                            ) : (
                                                                                <span>Escolha uma data</span>
                                                                            )}
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar
                                                                        mode={'single'}
                                                                        selected={field.value || undefined}
                                                                        onSelect={field.onChange}
                                                                        disabled={(date) => date < new Date("2000-01-01")}
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>}
                                        {selected_filters.includes('ocorrencia') &&
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name={'ocorrencia'}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Ocorrência</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={'w-full'}>
                                                                        <SelectValue placeholder="Escolha uma opção" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className={'max-h-60'}>
                                                                    {ocorrencia.map(tempo => (
                                                                        <SelectItem value={tempo.value} key={tempo.value}>
                                                                            {tempo.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>}
                                        {selected_filters.includes('tipo') &&
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name={'tipo'}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Tipo de produto</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={'w-full'}>
                                                                        <SelectValue placeholder="Comidas ou bebidas" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className={'max-h-60'}>
                                                                    {tipo.map(tipo => (
                                                                        <SelectItem value={tipo.value} key={tipo.value}>
                                                                            {tipo.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>}
                                    </div>
                                </section>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    )
}

const ocorrencia = [
    { label: 'Eventos passados', value: 'passado' },
    { label: 'Eventos futuros', value: 'futuro' },
    { label: 'Eventos acontecendo agora', value: 'presente' },
]

const tipo = [
    { label: 'Comidas', value: 'comida' },
    { label: 'Bebidas', value: 'bebida' },
]