'use server'

// Supabase
import { createClient } from "@/utils/supabase/server"
// Validation
import { update_evento_validation } from "@/validation/update_evento"
// Next
import { revalidatePath } from "next/cache"
// Libs
import { z } from "zod"

export const updateEvento = async (data: z.infer<typeof update_evento_validation>, token_evento: string) => {

    const error_message = 'Erro ao atualizar o evento.'

    const supabase = await createClient()

    const { time_start, time_end, ...rest } = data;

    const evento = await supabase.from('events').update(
        {
            ...rest,
            datetime_start: rest.datetime_start.toISOString(),
            datetime_end: rest.datetime_end.toISOString()
        }
    ).eq('token', token_evento)

    if (evento.error) {
        console.log(evento.error?.message)
        return error_message
    }

    revalidatePath('/meus-eventos/[token]', 'page')
}