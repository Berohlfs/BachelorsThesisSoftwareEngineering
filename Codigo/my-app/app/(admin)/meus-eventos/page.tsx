// Next
import { Metadata } from "next"
import Link from "next/link"
// Supabase
import { createClient } from "@/utils/supabase/server"
// Button
import { Button } from "@/components/ui/button"
// Icons
import { ArrowRight, Calendar, Clock } from "lucide-react"
// Utils
import { wireframeDivStyle } from "@/utils/general/wireframeDivStyle"
// Components
import { CreateEventoModal } from "./components/CreateEventoModal"
import { PaginationControls } from "@/app/components/Pagination"
import { SearchBarAndFilter } from "@/app/components/SearchBarAndFilter"
// Libs
import dayjs from "dayjs"
// Badge
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Meus Eventos"
}

type Props = {
  searchParams: Promise<{
    page: string,
    ocorrencia: string
    search: string
    inicio: string
    fim: string
  }>
}

export default async function MeusEventos({ searchParams }: Props) {

  const supabase = await createClient()

  const { page, search, ocorrencia, inicio, fim } = await searchParams

  const parsed_page = parseInt(page || "1")
  const limit = 5
  const offset = (parsed_page - 1) * limit

  const now = dayjs().toISOString()

  const { data: user } = await supabase.auth.getUser()

  const query = supabase
    .from('events')
    .select()
    .eq('organizer_id', user.user?.id || '')
    .range(offset, offset + limit - 1)

  const count_query = supabase
    .from('events')
    .select('id', { count: 'exact' })
    .eq('organizer_id', user.user?.id || '')

  if (search) {
    query.ilike('name', `%${search}%`)
    count_query.ilike('name', `%${search}%`)
  }

  if (ocorrencia === 'passado') {
    query.lte('datetime_end', now)
    count_query.lte('datetime_end', now)
  } else if (ocorrencia === 'futuro') {
    query.gte('datetime_start', now)
    count_query.gte('datetime_start', now)
  } else if (ocorrencia === 'presente') {
    query
      .lte('datetime_start', now)
      .gte('datetime_end', now)
    count_query
      .lte('datetime_start', now)
      .gte('datetime_end', now)
  }

  if (inicio && dayjs(inicio).isValid()) {
    query.gte('datetime_start', dayjs(inicio).toISOString())
    count_query.gte('datetime_start', dayjs(inicio).toISOString())
  }
  if (fim && dayjs(fim).isValid()) {
    query.lte('datetime_end', dayjs(fim).toISOString())
    count_query.lte('datetime_end', dayjs(fim).toISOString())
  }

  const { data } = await query

  const { count } = await count_query

  return (<>
    <section className={'p-5'}>
      <div className={'flex items-center justify-between gap-2'}>
        <h2 className={'font-extrabold text-lg pl-2'}>Meus Eventos</h2>
        <div className={'flex gap-2'}>
          <CreateEventoModal />
        </div>
      </div>

      <SearchBarAndFilter
        intervalo_label_fim={'Fim do evento até:'}
        intervalo_label_inicio={'Início do evento a partir de:'}
        label_search_bar={'Buscar por nome do evento'}
        selected_filters={['ocorrencia', 'inicio', 'fim']} />

      <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-3'}>
        {data && (data.length > 0 ?
          data.map(event => (
            <Link key={event.id} href={`/meus-eventos/${event.token}`}>
              <article className={'rounded-md flex flex-col gap-3 overflow-hidden bg-secondary hover:scale-102'}>
                <div
                  className="w-full h-24 bg-repeat-x bg-top bg-contain"
                  style={event.image_bucket_ref ?
                    ({ backgroundImage: `url(${supabase.storage.from('banners').getPublicUrl(event.image_bucket_ref || '').data.publicUrl}` })
                    : wireframeDivStyle} />

                <div className={'p-3 pt-0'}>
                  <div>
                    <p className={'font-bold text-sm m1-2'}>{event.name}</p>
                    <p className={'text-xs text-muted-foreground truncate whitespace-nowrap overflow-hidden mb-2'}>{event.location}</p>
                  </div>

                  <p className={'text-sm truncate whitespace-nowrap overflow-hidden'}>
                    {event.description}
                  </p>
                  <div className="mt-2 flex flex-col gap-1">
                    <Badge variant={'outline'}>
                      <Clock />
                      {dayjs(event.datetime_start).format('[De] HH:mm [do dia] DD/MM/YYYY')}
                    </Badge>
                    <Badge variant={'outline'}>
                      <Clock />
                      {dayjs(event.datetime_end).format('[Até] HH:mm [do dia] DD/MM/YYYY')}
                    </Badge>
                  </div>

                  <div className={'flex items-center justify-end mt-3'}>
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
          <p className={'pl-2 text-sm text-muted-foreground'}>Nenhum evento para esses filtros...</p>
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
