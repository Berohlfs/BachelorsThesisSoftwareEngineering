'use server';

// Supabase
import { createClient } from "@/utils/supabase/server"
// Validation
import { create_produto_validation } from "@/validation/create_produto"
// Next
import { revalidatePath } from "next/cache"
// Libs
import { z } from "zod"

export const createProduto = async (data: z.infer<typeof create_produto_validation>) => {

  const supabase = await createClient()

  const {data: user} = await supabase.auth.getUser()
  
  const { error } = await supabase.from('products').insert({
    ...data,
    price: Number(data.price),
    organizer_id: user.user?.id || ''
  })
  
  if(error){
    console.log(error.message)
    return `Erro ao criar o produto`
  }
  revalidatePath('/meus-produtos')
}