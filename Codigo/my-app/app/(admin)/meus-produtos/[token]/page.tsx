
import { Metadata } from "next"
// Supabase
import { createClient } from "@/utils/supabase/server"
// Components
import { ProdutoForm } from "./components/ProdutoForm"
import { UploadPicture } from "./components/UploadPicture"
import { wireframeDivStyle } from "@/utils/general/wireframeDivStyle"

export const metadata: Metadata = {
  title: "Produto"
}

type Props = {
  params: Promise<{
    token: string
  }>
}

export default async function ProductShowPage({ params }: Props) {
  const supabase = await createClient()

  const { token } = await params

  const { data, error } = await supabase.from('products').select().eq('token', token).single()

  console.log(data, error)

  if (!data) {
    return <p className="p-6 text-muted-foreground">Produto não encontrado</p>
  }

  const default_values = {
    name: data?.name || '',
    description: data?.description || '',
    price: String(data?.price ?? ''),
    category: data?.category as 'comida' | 'bebida',
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-lg font-bold mb-4">Dados do Produto</h2>

      <div className="relative w-80 aspect-square rounded-md overflow-hidden mx-auto">

      <div
          className="absolute inset-0 bg-no-repeat bg-center bg-cover"
          style={
            data?.image_bucket_ref
              ? {
                backgroundImage: `url(${supabase.storage
                  .from("products")
                  .getPublicUrl(data?.image_bucket_ref || "").data.publicUrl})`,
              }
              : wireframeDivStyle
          }
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-40" />

        <div className="relative z-10 w-full h-full flex justify-center items-center">
          <UploadPicture token_produto={data?.token || ''} />
        </div>
      </div>

      <ProdutoForm default_values={default_values} token={data?.token || ''} />
    </div>
  )
}
