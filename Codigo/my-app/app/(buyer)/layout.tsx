// React
import { ReactNode } from "react"
// Components
import { MenuProfile } from "../components/MenuProfile"
import { TuscanTitle } from "../components/SimpleHeader"
import { ResponsiveNavBar } from "../components/ResponsiveNavBar"
// Supabase
import { createClient } from "@/utils/supabase/server"
// Shadcn
import { Button } from "@/components/ui/button"
// Next
import Link from "next/link"
// Icons
import { ShoppingBasket } from "lucide-react"

type Props = {
  children: ReactNode
}

export default async function BuyerLayout({ children }: Props) {

  const supabase = await createClient()

  const { data, /*error*/ } = await supabase.auth.getUser()

  const profile = data ? await supabase.from('profiles').select('*').eq('id', data.user?.id ?? '').single() : null

  return (
    <>
      <header className={'flex justify-between items-center p-3 border-b fixed top-0 w-full bg-background z-10 h-14'}>
        <TuscanTitle />

        <nav className={'flex items-center gap-4'}>
          <ul className={'hidden sm:flex'}>
            <li>
              <Button asChild variant={'link'} size={'sm'} className={'text-xs'}>
                <Link href={'/minhas-compras'}>
                  Minhas Compras
                  <ShoppingBasket />
                </Link>
              </Button>
            </li>
          </ul>

          <ResponsiveNavBar 
            nav_array={[{route: '/minhas-compras', label: 'Minhas Compras', Icon: <ShoppingBasket />}]}/>

          <MenuProfile
            role={data.user?.user_metadata.role}
            email={data.user?.user_metadata.email || ''}
            avatar_url={profile?.data?.avatar_url || ''}
            full_name={profile?.data?.full_name || ''} />
        </nav>

      </header>
      <main className={'relative top-14'}>
        {children}
      </main>
    </>
  )
}
