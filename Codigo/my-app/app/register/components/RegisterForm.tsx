"use client"

// Libs
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
// Shadcn
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// Validation
import { register_default_values, register_validation } from "@/validation/register"
// Icons
import { UserPlus } from "lucide-react"
// Actions
import { registerPassword } from "@/app/components/actions/registerPassword"
// React
import { useTransition } from "react"
// Libs
import { toast } from "sonner"
// Components
import { CircularProgress } from "@/app/components/CircularProgress"

export function RegisterForm() {

    const [pending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof register_validation>>({
        resolver: zodResolver(register_validation),
        defaultValues: register_default_values
    })

    function onSubmit(data: z.infer<typeof register_validation>) {
        startTransition(async()=> {
            const res = await registerPassword(data)
            if(res){
                toast.warning(res)
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name={'email'}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite seu e-mail" {...field} />
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
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <Input
                                    type={'password'}
                                    placeholder="Digite sua senha" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'confirm_password'}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <Input 
                                    type={'password'}
                                    placeholder="Digite sua senha" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button 
                    type="submit" 
                    className={'w-full'}>
                        {pending ?
                        <CircularProgress/>
                        :
                        <>
                        Cadastrar <UserPlus/>
                        </>}
                </Button>
            </form>
        </Form>
    )
}
