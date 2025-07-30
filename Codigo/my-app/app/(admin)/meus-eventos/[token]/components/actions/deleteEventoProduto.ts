'use server'

// Supabase
import { createClient } from "@/utils/supabase/server"
// Next
import { revalidatePath } from "next/cache"

export const deleteEventoProduto = async(id: number)=> {

    const supabase = await createClient()

    const evento = await supabase.from('events_products').delete().eq('id', id)

    if(evento.error){
        console.log(evento.error?.message)
        return 'Erro ao excluir o produto deste evento'
    }
    
    revalidatePath('/meus-eventos/[token]', 'page')
}