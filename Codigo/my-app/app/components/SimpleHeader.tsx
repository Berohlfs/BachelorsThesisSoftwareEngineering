// Next
import Link from "next/link"

export const TuscanTitle = () => {
    return (
        <h1 className={'font-extrabold text-xl'}>
            TU<span className={'text-primary'}>SCAN</span>
        </h1>
    )
}

export const SimpleHeader = () => {
    return (
        <header className={'flex pt-5 px-4'}>
            <Link href={'/'}>
                <TuscanTitle />
            </Link>
        </header>
    )
}