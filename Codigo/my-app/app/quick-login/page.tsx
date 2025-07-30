// Components
import { GoogleProviderLoginButton } from "@/app/components/GoogleProviderLoginButton"
import { TuscanTitle } from "../components/SimpleHeader"

type Props = {
  searchParams: Promise<{
    redirect?: string
  }>
}

export default async function QuickLogin({searchParams}: Props) {

  const {redirect} = await searchParams

  return (
    <div className={'mt-15 mx-auto p-6 rounded-lg border w-4/5 max-w-[300px] flex flex-col items-center'}>
        <TuscanTitle/>
        <h1 className={'text-center font-bold text-lg mt-4'}>
            Você está quase lá!
        </h1>
        <p className={'text-center text-muted-foreground text-sm mb-2 mt-2'}>
            para a sua segurança, realize seu login primeiro!
        </p>
        <GoogleProviderLoginButton custom_redirect_url={redirect}/>
    </div>
  )
}

