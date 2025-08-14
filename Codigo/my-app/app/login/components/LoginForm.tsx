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
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// Validation
import { login_default_values, login_validation } from "@/validation/login"
// Icons
import { LogIn } from "lucide-react"
// Actions
import { loginPassword } from "@/app/components/actions/loginPassword"
// React
import { useTransition } from "react"
// Components
import { CircularProgress } from "@/app/components/CircularProgress"

export function LoginForm() {

    const [pending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof login_validation>>({
        resolver: zodResolver(login_validation),
        defaultValues: login_default_values
    })

    function onSubmit(data: z.infer<typeof login_validation>) {
        startTransition(() => {
            loginPassword(data).then(res => {
                if (res) {
                    toast.warning(res)
                }
            })
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
                <Button
                    type="submit"
                    className={'w-full'}>
                    {pending ?
                        <CircularProgress />
                        :
                        <>
                            Entrar <LogIn />
                        </>}

                </Button>
            </form>
        </Form>
    )
}
