// Next
import { Metadata } from "next"
// Supabase
import { createClient } from "@/utils/supabase/server"
// Button
import { Button } from "@/components/ui/button"
// Icons
import { ArrowRight, Filter } from "lucide-react"
// Utils
import { wireframeDivStyle } from "@/utils/general/wireframeDivStyle"
// Components
import { CreateProdutoModal } from "./components/CreateProdutoModal"
import Link from "next/link"
import { PaginationControls } from "@/app/components/Pagination"
import { SearchBarAndFilter } from "@/app/components/SearchBarAndFilter"
// Libs
import dayjs from "dayjs"

export const metadata: Metadata = {
  title: "Meus Produtos"
}

type Props = {
  searchParams: Promise<{
    page: string,
    tipo: string
    search: string
    inicio: string
    fim: string
  }>
}

export default async function MeusProdutos({ searchParams }: Props) {

  const supabase = await createClient()

  const { page, search, inicio, fim, tipo } = await searchParams

  const parsed_page = parseInt(page || "1")
  const limit = 10
  const offset = (parsed_page - 1) * limit

  const { data: user } = await supabase.auth.getUser()

  const query = supabase
    .from('products')
    .select()
    .eq('organizer_id', user.user?.id || '')
    .range(offset, offset + limit - 1)

  const count_query = supabase
    .from('products')
    .select('id', { count: 'exact' })
    .eq('organizer_id', user.user?.id || '')

  if (search) {
    query.ilike('name', `%${search}%`)
    count_query.ilike('name', `%${search}%`)
  }

  if (tipo === 'comida') {
    query.eq('category', 'comida')
    count_query.eq('category', 'comida')
  } else if (tipo === 'bebida') {
    query.eq('category', 'bebida')
    count_query.eq('category', 'bebida')
  }

  if (inicio && dayjs(inicio).isValid()) {
    query.gte('created_at', dayjs(inicio).toISOString())
    count_query.gte('created_at', dayjs(inicio).toISOString())
  }
  if (fim && dayjs(fim).isValid()) {
    query.lte('created_at', dayjs(fim).toISOString())
    count_query.lte('created_at', dayjs(fim).toISOString())
  }

  const { data } = await query

  const { count } = await count_query

  return (<>
    <section className={'p-5'}>
      <div className={'flex items-center justify-between gap-2'}>
        <h2 className={'font-extrabold text-lg pl-2'}>Meus Produtos</h2>
        <div className={'flex gap-2'}>
          <CreateProdutoModal />
        </div>
      </div>

      <SearchBarAndFilter
        intervalo_label_fim={'Cadastro antes de:'}
        intervalo_label_inicio={'Cadastro depois de:'}
        label_search_bar={'Buscar por nome do produto'}
        selected_filters={['tipo', 'inicio', 'fim']} />

      <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-3'}>
        {data && (data.length > 0 ?
          data.map(product => (
            <Link href={`/meus-produtos/${product.token}`} key={product.id}>
              <article className={'flex flex-col gap-1 overflow-hidden items-center hover:scale-102 rounded-md p-5'}>
                <div
                  className="h-30 border rounded-full aspect-square bg-repeat bg-top bg-contain"
                  style={product.image_bucket_ref ?
                    ({ backgroundImage: `url(${supabase.storage.from('products').getPublicUrl(product.image_bucket_ref || '').data.publicUrl}` })
                    : wireframeDivStyle} />

                <div className={'p-3'}>
                  <div>
                    <p className={'text-center font-bold text-sm'}>{product.name}</p>
                    <p className={'text-center text-xs text-muted-foreground mt-1'}>R$ {product.price?.toFixed(2)}</p>
                  </div>

                  <p className={'text-sm truncate whitespace-nowrap overflow-hidden text-center mt-2'}>
                    {product.description}
                  </p>

                  <div className={'flex items-center justify-center mt-3'}>
                    <Button
                      size={'icon'}
                      className={'rounded-full'}>
                      <ArrowRight />
                    </Button>
                  </div>
                </div>
              </article>
            </Link>
          ))
          :
          <p className={'pl-2 text-sm text-muted-foreground'}>
            Nenhum produto para esses filtros...
          </p>
        )}
      </div>
    </section>
    <div className={'justify-end px-7'}>
      <PaginationControls
        my={3}
        total_items={count || 0}
        current_page={parsed_page}
        items_per_page={limit} />
    </div>
  </>)
}
