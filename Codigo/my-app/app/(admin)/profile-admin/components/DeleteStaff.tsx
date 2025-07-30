'use client';

// Libs
import { toast } from "sonner"
// Shadcn
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
// Icons
import { Trash } from "lucide-react"
// Actions
import { deleteStaff } from "./actions/deleteStaff"
// React
import { useEffect, useState, useTransition } from "react"
// Components
import { CircularProgress } from "@/app/components/CircularProgress"

type Props = {
    id: number
}

export const DeleteStaffModal = ({ id }: Props) => {

    const [pending, startTransition] = useTransition()

    const [open, setOpen] = useState(false)

    function deleteStaffCalback() {
        startTransition(async () => {
            const res = await deleteStaff(id)
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
                <Button size={'icon'} variant={'destructive'}>
                    <Trash />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir Acesso</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir este acesso?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        onClick={deleteStaffCalback}
                        disabled={pending}
                        variant={'destructive'}>
                        {pending ?
                            <CircularProgress />
                            :
                            <>
                                Excluir <Trash />
                            </>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}