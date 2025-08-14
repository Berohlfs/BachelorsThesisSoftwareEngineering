// Next
import { Metadata } from "next"
// Icons
import {
  ShoppingBasket,
  ShoppingCartIcon,
  TicketIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react"
// Shadcn
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ChartRevenue } from "./components/chart-revenue"
import { TopSellingProductsChart } from "./components/chart-visitors"
import { EventsTable } from "./components/events-table"
import { createClient } from "@/utils/supabase/server"
// Components
import { ExportarPDF } from "./components/Export"
// Libs
import dayjs from "dayjs"
import { OrdersTable } from "./components/orders-table"

export const metadata: Metadata = {
  title: "Dashboard"
}

export default async function Dashboard() {
  const supabase = await createClient()


  const { data: userData } = await supabase.auth.getUser()
  const userId = userData?.user?.id

  if (!userId) {
    return <p className="text-red-500">Erro: usuário não autenticado.</p>
  }
  // Buscar eventos do organizador
  const { data: events, error: eventError } = await supabase
    .from('events')
    .select('id')
    .eq('organizer_id', userId)

  if (eventError || !events || events.length === 0) {
    return (
      <div className={'flex flex-col py-20 items-center gap-2'}>
        <h1 className={'text-2xl font-bold'}>Dashboard inativo</h1>
        <p className="text-muted-foreground">
          Para ativá-lo, cadastre seu primeiro evento!
        </p>
      </div>
    )
  }

  const eventIds = events.map(e => e.id)

  // Datas de referência
  const now = new Date()
  const start30d = new Date(now)
  start30d.setDate(start30d.getDate() - 30)

  const start60d = new Date(now)
  start60d.setDate(start60d.getDate() - 60)
  // Pedidos pagos
  const { data: orders } = await supabase
    .from('orders')
    .select('id, total,status')
    .in('event_id', eventIds)
    .eq('status', 'paid')
    .gte('created_at', start30d.toISOString())

  const orderIds = orders?.map((o) => o.id) ?? []
  const totalRevenue =
    orders?.reduce((acc, order) => acc + (order.total || 0), 0) || 0

  //Pedidos de 30 a 60 dias atrás
  const { data: previousOrders } = await supabase
    .from('orders')
    .select('id, total')
    .in('event_id', eventIds)
    .eq('status', 'paid')
    .gte('created_at', start60d.toISOString())
    .lt('created_at', start30d.toISOString())

  const previousRevenue = previousOrders?.reduce((acc, order) => acc + (order.total || 0), 0) ?? 0

  // Variação percentual
  const revenueDiffPercent = previousRevenue > 0
    ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
    : 0
  // Ticket médio nos últimos 30 dias
  const averageTicket = orders && orders.length > 0
    ? totalRevenue / orders.length
    : 0
  // Produto mais vendido
  const { data: topProducts } = await supabase
    .from('order_items')
    .select('name')
    .in('order_id', orderIds)

  const productSalesMap = new Map<string, number>()

  topProducts?.forEach((item) => {
    const name = item.name ?? 'Produto desconhecido'
    const current = productSalesMap.get(name) ?? 0
    productSalesMap.set(name, current + 1)
  })

  const sorted = Array.from(productSalesMap.entries()).sort(
    (a, b) => b[1] - a[1]
  )

  const topProduct = sorted[0]?.[0] ?? 'Nenhum'
  const topProductQty = sorted[0]?.[1] ?? 0

  //taxa de conversão
  const totalCreated = orders?.length ?? 0
  const totalPaid = orders?.filter(order => order.status === 'paid').length ?? 0
  const conversionRate = totalCreated > 0 ? (totalPaid / totalCreated) * 100 : 0

  // Gerar os 6 produtos mais vendidos
  const chartData = Array.from(productSalesMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, quantity]) => ({
      name,
      quantity,
    }))

  const { data: events_table } = await supabase
    .from('events')
    .select(`
    id,
    name,
    datetime_end,
    orders (
      total
    )
  `)
    .eq('organizer_id', userId)
    .order('datetime_end', { ascending: false })
    .limit(10)

  const eventos_list = events_table?.map(event => {
    const orders = event.orders || []
    const faturamento = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const ticket_medio = orders.length > 0 ? faturamento / orders.length : 0

    return {
      id: event.id,
      name: event.name,
      faturamento,
      ticket_medio,
      datetime_end: event.datetime_end
    }
  }) || []

  const { data: orders_last_12_monhts } = await supabase
    .from('orders')
    .select('id, total, status, created_at')
    .in('event_id', eventIds)
    .eq('status', 'paid')
    .gte('created_at', dayjs().subtract(12, 'month').startOf('month').toISOString());

  const grouped = orders_last_12_monhts && orders_last_12_monhts.reduce((acc, order) => {
    const month = new Date(order.created_at).toISOString().slice(0, 7); // e.g. '2025-06'
    if (!acc[month]) acc[month] = { total_revenue: 0, total_orders: 0 };
    acc[month].total_revenue += Number(order.total);
    acc[month].total_orders += 1;
    return acc;
  }, {} as Record<string, { total_revenue: number; total_orders: number }>);

  const result = grouped ? Object.entries(grouped)
    .map(([month, stats]) => ({ month, ...stats }))
    .sort((a, b) => a.month.localeCompare(b.month)) : []

  const last_12_months = [
    { month: dayjs().subtract(11, 'month').format('YYYY-MM'), total_revenue: 0, total_orders: 0 },
    { month: dayjs().subtract(10, 'month').format('YYYY-MM'), total_revenue: 0, total_orders: 0 },
    { month: dayjs().subtract(9, 'month').format('YYYY-MM'), total_revenue: 0, total_orders: 0 },
    { month: dayjs().subtract(8, 'month').format('YYYY-MM'), total_revenue: 0, total_orders: 0 },
    { month: dayjs().subtract(7, 'month').format('YYYY-MM'), total_revenue: 0, total_orders: 0 },
    { month: dayjs().subtract(6, 'month').format('YYYY-MM'), total_revenue: 0, total_orders: 0 },
    { month: dayjs().subtract(5, 'month').format('YYYY-MM'), total_revenue: 0, total_orders: 0 },
    { month: dayjs().subtract(4, 'month').format('YYYY-MM'), total_revenue: 0, total_orders: 0 },
    { month: dayjs().subtract(3, 'month').format('YYYY-MM'), total_revenue: 0, total_orders: 0 },
    { month: dayjs().subtract(2, 'month').format('YYYY-MM'), total_revenue: 0, total_orders: 0 },
    { month: dayjs().subtract(1, 'month').format('YYYY-MM'), total_revenue: 0, total_orders: 0 },
    { month: dayjs().format('YYYY-MM'), total_revenue: 0, total_orders: 0 },
  ]

  for (const obj of result) {
    const index = last_12_months.findIndex(item => obj.month === item.month)
    last_12_months[index] = obj
  }

  const { data: last_10_orders } = await supabase
    .from('orders')
    .select(`
      id, 
      total, 
      created_at,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .in('event_id', eventIds)
    .eq('status', 'paid')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6 relative">

      <div className="flex justify-end absolute top-3 right-3">
        <ExportarPDF />
      </div>

      <div id="content-to-print" className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Faturamento</CardTitle>
              <CardDescription>{totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} nos último 30 dias</CardDescription>
            </CardHeader>
            <CardFooter>
              <Badge variant="outline">
                { }
                {revenueDiffPercent >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                {revenueDiffPercent == 0 ? " - " : Math.abs(revenueDiffPercent).toFixed(1) + "%"}
              </Badge>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ticket Médio</CardTitle>
              <CardDescription>{averageTicket.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })} por venda</CardDescription>
            </CardHeader>

            <CardFooter>
              <Badge variant="outline">
                <TicketIcon className="mr-1 h-4 w-4" /> valor médio
              </Badge>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Produto Mais Vendido</CardTitle>
              <CardDescription>{topProduct}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Badge variant="outline">
                <ShoppingBasket />
                {topProductQty} vendas nos últimos 30 dias
              </Badge>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Taxa de conversão</CardTitle>
              <CardDescription>Nos últimos 30 dias {conversionRate.toFixed(0)}% dos pedidos iniciados foram pagos </CardDescription>
            </CardHeader>
            <CardFooter>
              <Badge variant="outline">
                <ShoppingCartIcon />
                {conversionRate.toFixed(0)}%
              </Badge>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 @4xl/page:grid-cols-[2fr_1fr]">
          <ChartRevenue data={last_12_months || []} />
          <TopSellingProductsChart data={chartData} />
        </div>

        <Tabs defaultValue="vendas" className="gap-6">
          <div
            data-slot="dashboard-header"
            className="flex items-center justify-between"
          >
            <TabsList className="w-full @3xl/page:w-fit">
              <TabsTrigger value="vendas">Últimas Vendas</TabsTrigger>
              <TabsTrigger value="eventos">Últimos Eventos</TabsTrigger>
            </TabsList>

          </div>
          <TabsContent value="vendas">
            <OrdersTable orders={last_10_orders || []} event_ids={eventIds} />
          </TabsContent>
          <TabsContent value="eventos">
            <EventsTable eventos={eventos_list} />
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}