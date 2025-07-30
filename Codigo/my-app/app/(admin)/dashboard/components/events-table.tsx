// Shadcn
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
// Libs
import dayjs from "dayjs"

type Props = {
  eventos: {
    id: number
    name: string
    ticket_medio: number
    faturamento: number
    datetime_end: string
  }[]
}

export function EventsTable({ eventos }: Props) {
  return (
    <Card className="flex w-full flex-col gap-4">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Últimos Eventos</TableHead>
              <TableHead>Ticket Médio</TableHead>
              <TableHead>Faturamento</TableHead>
              <TableHead>Término</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:py-2.5">
            {eventos && eventos.map((evento) => (
              <TableRow key={evento.id}>
                <TableCell className="font-medium">{evento.name}</TableCell>
                <TableCell>
                  {evento.ticket_medio.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={"bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100"}
                  >
                    {evento.faturamento.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </Badge>
                </TableCell>
                <TableCell>{dayjs(evento.datetime_end).format('DD/MM/YYYY [às] HH:mm')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
