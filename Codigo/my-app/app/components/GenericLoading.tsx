// Components
import { CircularProgress } from "./CircularProgress"

const GenericLoading = ()=> {
    return (
        <section className={'h-[calc(100vh-100px)] w-full flex items-center justify-center'}>
            <div className={'flex flex-col justify-center items-center gap-4'}>
                <CircularProgress dark/>
                <p className={'text-xs'}>Carregando...</p>
            </div>
        </section>
    )
}

export default GenericLoading