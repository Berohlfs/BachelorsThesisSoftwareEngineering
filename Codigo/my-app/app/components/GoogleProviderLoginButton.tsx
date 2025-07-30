
'use client'

// Next
import Image from "next/image"
// Actions
import { loginGoogleProvider } from "./actions/loginGoogleProvider"
// React
import { useTransition } from "react"
// Components
import { CircularProgress } from "./CircularProgress"

type Props = {
    custom_redirect_url?: string
}

export const GoogleProviderLoginButton = ({ custom_redirect_url }: Props) => {

    const [pending, startTransition] = useTransition()

    return (
        <button className="text-sm py-2 px-4 items-center border flex gap-3 rounded-lg text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150 cursor-pointer mt-4 w-full justify-center"
            onClick={() => {
                startTransition(async () => {
                    await loginGoogleProvider(custom_redirect_url)
                })
            }}
            disabled={pending}>

            {pending ?

                <CircularProgress dark />

                :

                <>
                    <Image
                        height={20}
                        width={20}
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        loading="lazy"
                        alt="google logo" />
                    <span className={'text-md font-bold'}>
                        Entrar com Google
                    </span>
                </>}

        </button>
    )
}