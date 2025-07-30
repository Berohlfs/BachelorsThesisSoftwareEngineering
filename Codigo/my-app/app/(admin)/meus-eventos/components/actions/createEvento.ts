'use server';

// Supabase
import { createClient } from "@/utils/supabase/server"
// Validation
import { create_evento_validation } from "@/validation/create_evento"
// Next
import { revalidatePath } from "next/cache"
// Libs
import { z } from "zod"

export const createEvento = async (data: z.infer<typeof create_evento_validation>) => {

  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()


  const { time_start, time_end, ...rest } = data;
  const { error } = await supabase.from('events').insert({
    ...rest,
    organizer_id: user.user?.id || '',
    datetime_start: data.datetime_start.toISOString(),
    datetime_end: data.datetime_end.toISOString()
  })
  if (error) {
    console.log(error.message)
    return `Erro ao criar o evento`
  }

  revalidatePath('/meus-eventos')
}