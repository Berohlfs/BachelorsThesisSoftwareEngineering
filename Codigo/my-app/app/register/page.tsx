// Components
import { RegisterForm } from "./components/RegisterForm"
import { SimpleHeader } from "../components/SimpleHeader"
// Shadcn
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
// Next
import Link from "next/link"

export default function Register() {
  return (<>
    <SimpleHeader/>

    <div className={'mt-10 mx-auto p-6 rounded-lg border w-4/5 max-w-[300px]'}>

      <h2 className={'text-center mb-2 mt-2 font-extrabold'}>
        TORNE-SE UM <span className={'text-primary'}>PARCEIRO</span>
      </h2>

      <p className={'text-xs text-muted-foreground text-center mb-5'}>
        Abra sua conta de organizador e começe a vender!
      </p>

      <RegisterForm />

      <div className={'flex items-center gap-2 mt-4'}>
        <Separator className={'flex-1'} />
        <p className={'text-xs'}>ou</p>
        <Separator className={'flex-1'} />
      </div>

      <Button asChild variant={'link'} className={'w-full'}>
        <Link href={'/login'}>Já tenho cadastro</Link>
      </Button>

    </div>
  </>)
}

