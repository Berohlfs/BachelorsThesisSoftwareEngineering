'use server';

// Supabase
import { createClient } from "@/utils/supabase/server"
// Validation
import { create_staff_validation } from "@/validation/create_staff"
// Next
import { revalidatePath } from "next/cache"
// Libs
import { z } from "zod"

export const addStaff = async (data: z.infer<typeof create_staff_validation>, event_id: number) => {

  const supabase = await createClient()
  
  const { error } = await supabase.from('staff').insert({
    ...data,
    event_id
  })
  
  if(error){
    console.log(error.message)
    return `Erro ao criar o acesso`
  }

  revalidatePath('/profile-admin')
}