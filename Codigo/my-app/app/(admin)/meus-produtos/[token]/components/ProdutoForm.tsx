'use client'

// Libs
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
// Shadcn
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Check, Edit, X } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
// Validation
import { update_produto_validation } from "@/validation/update_produto"
// Actions
import { updateProduto } from "./actions/updateProduto"
// React
import { useEffect, useState, useTransition } from "react"
// Components
import { CircularProgress } from "@/app/components/CircularProgress"


type Props = {
  default_values: z.infer<typeof update_produto_validation>,
  token: string
}

export const ProdutoForm = ({ default_values, token }: Props) => {

  const [disabled, setDisabled] = useState(true)

  const [pending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof update_produto_validation>>({
    resolver: zodResolver(update_produto_validation),
    defaultValues: default_values
  })

  const updateProdutoCallback = async (data: z.infer<typeof update_produto_validation>) => {
    startTransition(() => {
      updateProduto(data, token).then(res => {
        if (res) {
          toast.warning(res)
        } else {
          setDisabled(true)
        }
      })
    })
  }

  useEffect(() => {
    form.reset(default_values)
  }, [default_values])



  return (
<Form {...form}>
  <form onSubmit={form.handleSubmit((data) => updateProdutoCallback(data))}>
    <div className="flex justify-end items-center gap-2 my-5">
 
      <div className="flex gap-2">
        {disabled ? (
          <Button
            onClick={() => setDisabled(false)}
            type="button"
            size="sm"
            variant="outline"
          >
            Editar
            <Edit />
          </Button>
        ) : (
          <>
            <Button
              type="button"
              onClick={() => {
                setDisabled(true);
                form.reset();
              }}
              size="sm"
              variant="outline"
            >
              Cancelar
              <X />
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? <CircularProgress /> : <>Salvar <Check /></>}
            </Button>
          </>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
      <div className="col-span-1">
        <FormField
          
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="Digite o nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-1">
        <FormField
          
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="Digite a descrição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-1">
        <FormField
          
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <Input
                disabled={disabled}
                  placeholder="Digite o preço"
                  {...field}
                  masked={{
                    mask: Number,
                    radix: ",",
                    scale: 2,
                    min: 0,
                    thousandsSeparator: ".",
                    padFractionalZeros: true,
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-1">
        <FormField
          
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bebida">Bebida</SelectItem>
                  <SelectItem value="comida">Comida</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  </form>
</Form>

  )
}
