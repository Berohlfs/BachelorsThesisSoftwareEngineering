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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
// Validation
import { create_produto_default_values, create_produto_validation } from "@/validation/create_produto"
// Icons
import { Plus } from "lucide-react"
// Actions
import { createProduto } from "./actions/createProduto"
// React
import { useEffect, useState, useTransition } from "react"
// Components
import { CircularProgress } from "@/app/components/CircularProgress"

export const CreateProdutoModal = () => {

    const [pending, startTransition] = useTransition()

    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof create_produto_validation>>({
        resolver: zodResolver(create_produto_validation),
        defaultValues: create_produto_default_values
    })

    function onSubmit(data: z.infer<typeof create_produto_validation>) {
        startTransition(async () => {
            const res = await createProduto(data)
            if (res) {
                toast.warning(res)
            }
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
                    <DialogTitle>Criar Novo Produto</DialogTitle>
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
                                    <FormLabel>Nome do produto</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite o nome do produto" {...field} />
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
                                    <FormLabel>Descrição do produto</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Digite a descrição do produto" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'price'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preço do produto</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Digite o preço do produto" {...field}
                                            masked={{
                                                mask: Number,
                                                radix: ",",
                                                scale: 2,
                                                min: 0,
                                                thousandsSeparator: ".",
                                                padFractionalZeros: true,
                                            }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria do produto</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className={'w-full'}>
                                                <SelectValue placeholder="Selecione a categoria do produto" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="bebida">Bebida</SelectItem>
                                            <SelectItem value="comida">Comida</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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