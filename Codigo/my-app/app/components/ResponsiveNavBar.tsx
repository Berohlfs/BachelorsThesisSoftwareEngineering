"use client"

// Icons
import { Menu } from "lucide-react"
// Shadcn
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// Next
import { useRouter } from "next/navigation"
// React
import { JSX } from "react"

type Props = {
    nav_array: {
        route: string,
        label: string,
        Icon: JSX.Element
    }[]
}

export function ResponsiveNavBar({ nav_array }: Props) {

    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className={'flex sm:hidden'}>
                <Button variant="outline" size={'icon'}>
                    <Menu />
                    <span className="sr-only">Responsive Navigation Menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {nav_array.map(item => (
                    <DropdownMenuItem 
                        key={item.label}
                        onClick={() => router.push(item.route)}>
                        {item.label}
                        {item.Icon}
                    </DropdownMenuItem>
                ))}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
