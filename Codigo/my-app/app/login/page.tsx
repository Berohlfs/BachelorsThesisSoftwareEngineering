// Components
import { Separator } from "@/components/ui/separator"
import { SimpleHeader } from "../components/SimpleHeader"
import { LoginForm } from "./components/LoginForm"
// Next
import Link from "next/link"
// Shadcn
import { Button } from "@/components/ui/button"

export default function Login() {
  return (<>
    <SimpleHeader />
    
    <div className={'mt-10 mx-auto p-6 rounded-lg border w-4/5 max-w-[320px]'}>

      <h2 className={'text-center mb-6 mt-2 font-extrabold'}>
        PORTAL DO <span className={'text-primary'}>ORGANIZADOR</span>
      </h2>

      <LoginForm />

      <div className={'flex items-center gap-2 mt-4'}>
        <Separator className={'flex-1'} />
        <p className={'text-xs'}>ou</p>
        <Separator className={'flex-1'} />
      </div>

      <Button asChild variant={'link'} className={'w-full'}>
        <Link href={'/register'}>Cadastrar-me</Link>
      </Button>

    </div>
  </>
  )
}

