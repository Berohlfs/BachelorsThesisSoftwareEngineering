// Next
import { Metadata } from "next"
// Supabase
import { createClient } from "@/utils/supabase/server"
// Utils
import { wireframeDivStyle } from "@/utils/general/wireframeDivStyle"
// Components
import { UploadBanner } from "./components/UploadBanner"
import { EventoForm } from "./components/Form"
import { EventoProdutos } from "./components/EventoProdutos"

export const metadata: Metadata = {
    title: "Evento"
}

type Props = {
    params: Promise<{
        token: string
    }>
}

export default async function Evento({ params }: Props) {

    const supabase = await createClient()

    const { token } = await params

    const user = await supabase.auth.getUser()

    const { data } = await supabase
        .from('events')
        .select(`
            *,
            events_products (
                *,
                products(*)
            )
        `)
        .eq('token', token)
        .single()

    const { data: produtos } = await supabase.from('products').select().eq('organizer_id', user?.data?.user?.id || '')

    const produtos_divided = produtos?.map(produto => {
        for (const evento_produto of data?.events_products || []) {
            if (evento_produto.product_id === produto.id) {
                return { ...produto, stock: evento_produto.stock, included: true, evento_produto_id: evento_produto.id }
            }
        }
        return { ...produto, stock: undefined, included: false }
    })

    const produtos_divided_with_images = produtos_divided ? produtos_divided.map((item) => {
        return {
            ...item,
            image: item.image_bucket_ref
                ? supabase.storage
                    .from("products")
                    .getPublicUrl(item.image_bucket_ref || "").data.publicUrl
                : 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
        }
    }) : []

    const default_values = {
        name: data?.name || '',
        description: data?.description || '',
        location: data?.location || '',
        datetime_start: data?.datetime_start ? new Date(data.datetime_start) : new Date(),
        datetime_end: data?.datetime_end ? new Date(data.datetime_end) : new Date(),
        time_start: data?.datetime_start
            ? new Date(data.datetime_start).toLocaleTimeString("pt-BR", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
            : "20:00:00",

        time_end: data?.datetime_end
            ? new Date(data.datetime_end).toLocaleTimeString("pt-BR", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
            : "03:00:00",


    }

    return (
        <section className={'p-5'}>

            <div className="relative w-full h-30 rounded-md overflow-hidden">
                <div
                    className="absolute inset-0 bg-repeat-x bg-top bg-contain"
                    style={
                        data?.image_bucket_ref
                            ? {
                                backgroundImage: `url(${supabase.storage
                                    .from("banners")
                                    .getPublicUrl(data?.image_bucket_ref || "").data.publicUrl})`,
                            }
                            : wireframeDivStyle
                    }
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black opacity-40" />

                <div className="relative z-10 w-full h-full flex justify-center items-center">
                    <UploadBanner token_evento={data?.token || ''} />
                </div>
            </div>

            <EventoForm default_values={default_values} token={data?.token || ''} />

            <EventoProdutos produtos={produtos_divided_with_images} id_evento={data?.id || 0} />

        </section>
    )
}
