'use server'

// Supabase
import { createClient } from "@/utils/supabase/server"
// Next
import { revalidatePath } from "next/cache"

export const addEventoProduto = async(id_produto: number, id_evento: number, quantidade: number)=> {

    const supabase = await createClient()

    const evento = await supabase.from('events_products').insert({
        event_id: id_evento,
        product_id: id_produto,
        stock: quantidade,
        is_active: true
    })

    if(evento.error){
        console.log(evento.error?.message)
        return 'Erro ao adicionar o produto a este evento'
    }
    
    revalidatePath('/meus-eventos/[token]', 'page')
}