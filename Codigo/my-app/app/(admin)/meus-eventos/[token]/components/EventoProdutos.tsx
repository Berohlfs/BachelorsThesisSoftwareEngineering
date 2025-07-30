'use client'

// Shadcn
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableCaption,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    //DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
// Icons
import { ArrowRightFromLine, Check, Plus, X } from "lucide-react"
// React
import { useState, useTransition } from "react"
// Actions
import { deleteEventoProduto } from "./actions/deleteEventoProduto"
import { addEventoProduto } from "./actions/addEventoProduto"
// Libs
import { toast } from "sonner"
// Components
import { CircularProgress } from "@/app/components/CircularProgress"
import { Input } from "@/components/ui/input"

type PropsDelete = {
    id: number
}

const DeleteButton = ({ id }: PropsDelete) => {

    const [pending, startTransition] = useTransition()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size={'sm'}
                    variant={'destructive'}>
                    Remover
                    <ArrowRightFromLine />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Remover produto deste evento?</DialogTitle>
                    {/* <DialogDescription>
                        Forneça a quantidade em estoque
                    </DialogDescription> */}
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant={'destructive'}
                        onClick={() => startTransition(() => {
                            deleteEventoProduto(id).then(res => {
                                if (res) {
                                    toast.warning(res)
                                }
                            })
                        })}
                        disabled={pending}>

                        {pending ? <CircularProgress /> : <>
                            Remover
                            <ArrowRightFromLine />
                        </>}

                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

type PropsAdd = {
    id_produto: number
    id_evento: number
}

const AddButton = ({ id_produto, id_evento }: PropsAdd) => {

    const [pending, startTransition] = useTransition()
    const [quantidade, setQuantidade] = useState<number | null>(null)
    const [inputTouched, setInputTouched] = useState(false)

    const isValid = typeof quantidade === "number" && quantidade > 0

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={'icon'}>
                    <Plus />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar produto a este evento?</DialogTitle>
                    <DialogDescription>

                        Forneça a quantidade em estoque
                    </DialogDescription>
                    <Input
                        type="number"
                        placeholder="Quantidade"
                        value={quantidade ?? ""}
                        min={1}
                        step={1}
                        onBlur={() => setInputTouched(true)}
                        onChange={(e) => {
                            const value = e.target.value
                            setQuantidade(value === "" ? null : Number(value))
                        }}
                    />
                    {!isValid && inputTouched && (
                        <p className="text-sm text-red-500">Informe uma quantidade válida</p>
                    )}
                </DialogHeader>

                <DialogFooter>
                    <Button
                        onClick={() => {
                            if (!isValid) {
                                setInputTouched(true)
                                return
                            }
                            startTransition(() => {
                                addEventoProduto(id_produto, id_evento, quantidade!).then((res) => {
                                    if (res) toast.warning(res)
                                })
                            })
                        }}
                        disabled={pending}>

                        {pending ? <CircularProgress /> : <>Adicionar <Plus /></>}

                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

type Props = {
    id_evento: number
    produtos: {
        stock?: number | null;
        included: boolean;
        evento_produto_id?: number;
        image: string;
        category: string;
        created_at: string;
        description: string;
        id: number;
        image_bucket_ref: string | null;
        name: string;
        organizer_id: string | null;
        price: number;
        token: string;
    }[]
}

export const EventoProdutos = ({ produtos, id_evento }: Props) => {

    return (
        <Tabs defaultValue="adicionados" className="w-full mt-8">
            <TabsList className="grid max-w-[600px] w-[100%] mx-auto grid-cols-2">
                <TabsTrigger value="adicionados">Produtos adicionados</TabsTrigger>
                <TabsTrigger value="nao-adicionados">Outros produtos</TabsTrigger>
            </TabsList>
            <TabsContent value="adicionados">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Estoque</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {produtos.filter(item => item.included).map(item => (
                            <TableRow key={item.id}>
                                <TableCell className={'w-14'}>
                                    <img
                                        className={'h-10 rounded-lg'}
                                        src={item.image} />
                                </TableCell>
                                <TableCell className={'w-32'}>
                                    <div className={'flex items-center gap-1'}>
                                        <Check size={14} className={'text-green-600 dark:text-green-400'} />
                                        <p className={'text-green-600 dark:text-green-400 text-xs font-bold'}>Adicionado</p>
                                    </div>
                                </TableCell>
                                <TableCell>{item?.name}</TableCell>
                                <TableCell>R${item?.price?.toFixed(2)}</TableCell>
                                <TableCell>{item.stock} unidades</TableCell>
                                <TableCell className={'text-right'}>
                                    <DeleteButton id={item.evento_produto_id || 0} />
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                    {produtos.filter(item => item.included).length === 0 &&
                        <TableCaption><p>Nenhum produto adicionado a este evento</p></TableCaption>}
                </Table>
            </TabsContent>
            <TabsContent value="nao-adicionados">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {produtos.filter(item => !item.included).map(item => (
                            <TableRow key={item.id}>
                                <TableCell className={'w-14'}>
                                    <img
                                        className={'h-10 rounded-lg'}
                                        src={item.image} />
                                </TableCell>
                                <TableCell className={'w-32'}>
                                    <div className={'flex items-center gap-1'}>
                                        <X size={14} className={'text-red-600 dark:text-red-400'} />
                                        <p className={'text-red-600 dark:text-red-400 text-xs font-bold'}>Fora do cardápio</p>
                                    </div>
                                </TableCell>
                                <TableCell>{item?.name}</TableCell>
                                <TableCell>R${item?.price?.toFixed(2)}</TableCell>
                                <TableCell className={'text-right'}>
                                    <AddButton id_produto={item.id} id_evento={id_evento} />
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                    {produtos.filter(item => !item.included).length === 0 &&
                        <TableCaption><p>Nenhum produto restante para adicionar</p></TableCaption>}
                </Table>
            </TabsContent>
        </Tabs>
    )
}