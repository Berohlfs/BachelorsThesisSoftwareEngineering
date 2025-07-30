'use client'

// Shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
// Components
import { LogoutButton } from "@/app/components/LogoutButton"
import { ModeToggle } from "./mode-toggle"
// Icons
import { User } from "lucide-react"
// Next
import { useRouter } from "next/navigation"

type Props = {
    avatar_url: string
    full_name: string
    email: string
    role: 'admin' | undefined
}

export const MenuProfile = ({ avatar_url, full_name, email, role }: Props) => {

    const router = useRouter()

    return (
        <Popover>
            <PopoverTrigger>
                <Avatar className={'hover:scale-110 cursor-pointer duration-100'}>
                    <AvatarImage src={avatar_url}/>
                    <AvatarFallback>
                        <User size={16}/>
                    </AvatarFallback>
                </Avatar>
            </PopoverTrigger>
            <PopoverContent>
                <p className={'text-center'}>
                    {full_name}
                </p>
                <p className={'text-center text-muted-foreground text-sm'}>
                    {email}
                </p>
                <Separator className={'my-4'}/>
                {role === 'admin' && 
                <div className={'flex flex-col mt-2'}>
                    <Button
                        onClick={()=> router.push(role === 'admin' ? '/profile-admin' : '/profile')}
                        variant={'link'}>
                        Meu Perfil
                        <User/>
                    </Button>
                </div>}
                <div className={'flex flex-col mt-2'}>
                    <ModeToggle variant={'button'}/>
                </div>
                <Separator className={'my-4'}/>
                <div className={'flex flex-col'}>
                    <LogoutButton />
                </div>
            </PopoverContent>
        </Popover>
    )
}