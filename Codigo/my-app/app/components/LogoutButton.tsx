'use client'

// Shadcn
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
// Actions
import { logout } from "./actions/logout"
// Icons
import { LogOut } from "lucide-react"
// React
import { useTransition } from "react"
import { CircularProgress } from "@/app/components/CircularProgress"

export const LogoutButton = () => {

    const [pending, startTransition] = useTransition()

    const logoutCallBack = async () => {
        startTransition(async ()=> {
            await logout()
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Sair
                    <LogOut />
                </Button>
            </DialogTrigger>
            <DialogContent className={'w-5/6 max-w-[600px] rounded-md'}>
                <DialogHeader>
                    <DialogTitle>Sair dessa sessão</DialogTitle>
                    <DialogDescription>
                        Tem certeza? Será necessário logar novamente.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className={'gap-2'}>
                    <DialogClose asChild>
                        <Button variant={'outline'}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button 
                        variant={'destructive'}
                        onClick={logoutCallBack} 
                        disabled={pending}>
                        {pending ?
                        <CircularProgress/>
                        :
                        <>
                        Sair 
                        <LogOut />
                        </>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}