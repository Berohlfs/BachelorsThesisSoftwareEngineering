// Next
import { Metadata } from "next"
import { createClient } from "@/utils/supabase/server"
import CardapioClient from "./components/Cardapio"

export const metadata: Metadata = {
  title: "Cardápio"
}

type Props = {
  params: Promise<{
    token: string
  }>
}
type Product = {
  id: string
  name: string
  description: string
  category: string
  price: number
  imageUrl: string | undefined
  img_ref?: string
  event_product_id: number
}


export default async function Cardapio({ params }: Props) {
  const { token } = await params

  const supabase = await createClient()

  const { data } = await supabase
    .from("events")
    .select(`
      *,
      events_products (
        *,
        products(*)
      )
    `)
    .eq("token", token)
    .single()

  if (!data) return <div>Evento não encontrado.</div>
  const now = new Date()
  const start = new Date(data.datetime_start)
  const end = new Date(data.datetime_end)

  const isEventOpen = now >= start && now <= end

  if (!isEventOpen) {
  return (
    <div className="text-center mt-10 text-muted-foreground">
      Este evento não está aberto para pedidos.
    </div>
  )
}

  const produtos: Product[] = data.events_products
    .filter(item => item.products && item.stock > 0)
    .map(item => {
      const product = item.products!;
      return {
        id: String(product.id),
        name: product.name ?? '',
        description: product.description ?? '',
        category: product.category ?? '',
        price: product.price ?? 0,
        img_ref: product.image_bucket_ref?? '',
        event_product_id: item.id,
        imageUrl: product.image_bucket_ref
          ? supabase.storage
            .from("products")
            .getPublicUrl(product.image_bucket_ref).data.publicUrl
          : undefined,
      };
    });


  const comidas = produtos.filter(p => p.category === "comida")
  const bebidas = produtos.filter(p => p.category === "bebida")

  const bannerImageUrl = data.image_bucket_ref
    ? supabase.storage
      .from("banners")
      .getPublicUrl(data.image_bucket_ref).data.publicUrl
    : null

  return (
    <CardapioClient
      token={data.token}
      comidas={comidas}
      bebidas={bebidas}
      imageUrl={bannerImageUrl || undefined}
      eventId={data.id}
    />
  )
}
