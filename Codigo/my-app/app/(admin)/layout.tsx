// React
import { ReactNode } from "react"
// Components
import { MenuProfile } from "../components/MenuProfile"
import { TuscanTitle } from "../components/SimpleHeader"
import { ResponsiveNavBar } from "../components/ResponsiveNavBar"
// Supabase
import { createClient } from "@/utils/supabase/server"
// Next
import Link from "next/link"
// Icons
import { Blocks, CalendarDays, ChartArea } from "lucide-react"
// Shadcn
import { Button } from "@/components/ui/button"

type Props = {
  children: ReactNode
}

export default async function AdminLayout({ children }: Props) {

  const supabase = await createClient()

  const { data, /*error*/ } = await supabase.auth.getUser()

  const nav_array = [
    {route: '/meus-eventos', label: 'Meus Eventos', Icon: <CalendarDays />},
    {route: '/meus-produtos', label: 'Meus Produtos', Icon: <Blocks />},
    {route: '/dashboard', label: 'Dashboard', Icon: <ChartArea />}
  ]

  return (
    <>
      <header className={'flex justify-between items-center p-3 border-b fixed w-full z-10 bg-background'}>
        <TuscanTitle />

        <nav className={'flex items-center gap-4'}>
          <ul className={'hidden sm:flex'}>
            <li>
              <Button asChild variant={'link'} size={'sm'} className={'text-xs'}>
                <Link href={'/meus-eventos'}>
                  Meus Eventos
                  <CalendarDays />
                </Link>
              </Button>
            </li>
            <li>
              <Button asChild variant={'link'} size={'sm'} className={'text-xs'}>
                <Link href={'/meus-produtos'}>
                  Meus Produtos
                  <Blocks />
                </Link>
              </Button>
            </li>
            <li>
              <Button asChild variant={'link'} size={'sm'} className={'text-xs'}>
                <Link href={'/dashboard'}>
                  Dashboard
                  <ChartArea />
                </Link>
              </Button>
            </li>
          </ul>

          <ResponsiveNavBar nav_array={nav_array}/>

          <MenuProfile
            role={data.user?.user_metadata.role}
            email={''}
            avatar_url={''}
            full_name={data.user?.email || ''} />
        </nav>
      </header>
      <main className={'relative top-14'}>
        {children}
      </main>
    </>
  )
}
