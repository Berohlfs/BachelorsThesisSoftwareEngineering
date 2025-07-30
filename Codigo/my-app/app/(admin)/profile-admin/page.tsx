// Next
import { Metadata } from "next"
// Shadcn
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
// Supabase
import { createClient } from "@/utils/supabase/server"
// Components
import { Badge } from "@/components/ui/badge"
import { AddStaffModal } from "./components/AddStaff"
import { DeleteStaffModal } from "./components/DeleteStaff"

export const metadata: Metadata = {
  title: "Meu Perfil"
}

export default async function MeusPerfilAdmin() {

  const supabase = await createClient()

  const user = await supabase.auth.getUser()

  const { data } = await supabase
    .from('staff')
    .select(`
    *,
    event:event_id (
      id,
      name,
      profiles:organizer_id (
        id
      )
    )
  `)
    .eq('event.profiles.id', user?.data?.user?.id || '')

  return (
    <div className={'p-6 relative'}>
      <p className={'font-extrabold relative'}>MEU DADOS</p>
      <section className={'relative flex flex-col gap-3 py-5'}>
        <Skeleton className={'h-10 w-full'}/>
        <Skeleton className={'h-10 w-full'}/>
        <Skeleton className={'h-10 w-full'}/>
      </section>

      <div className={'flex items-center justify-between gap-2'}>
        <p className={'font-extrabold mb-5'}>ACESSOS DE FUNCIONÁRIOS</p>
        <AddStaffModal user_id={user.data.user?.id || ''} />
      </div>

      <section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Login</TableHead>
              <TableHead>Chave de Acesso</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <div className="group inline-block">
                    <p>
                      <span className="group-hover:hidden">**********</span>
                      <span className="hidden group-hover:inline">{user.password}</span>
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={'secondary'}>
                    {user.event?.name}
                  </Badge>
                </TableCell>
                <TableCell className={'text-right'}>
                  <DeleteStaffModal id={user.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
