'use server'
// Supabase
import { createClient } from "@/utils/supabase/server"
// Validation
import { update_produto_validation } from "@/validation/update_produto"
// Next
import { revalidatePath } from "next/cache"
// Libs
import { z } from "zod"

export const updateProduto = async(data: z.infer<typeof update_produto_validation>, token_produto: string)=> {

    const error_message = 'Erro ao atualizar o produto.'

    const supabase = await createClient()

    const dataUpdate = {
        ...data,
        price: Number(data.price),
    }

    const produto = await supabase.from('products').update(dataUpdate).eq('token', token_produto)

    if(produto.error){
        console.log(produto.error?.message)
        return error_message
    }
    
    revalidatePath('/meus-produtos/[token]', 'page')
}