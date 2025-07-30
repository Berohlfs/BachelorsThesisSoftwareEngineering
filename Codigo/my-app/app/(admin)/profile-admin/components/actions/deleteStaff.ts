'use server';

// Supabase
import { createClient } from "@/utils/supabase/server"
// Next
import { revalidatePath } from "next/cache"

export const deleteStaff = async (id: number) => {

  const supabase = await createClient()
  
  const { error } = await supabase.from('staff').delete().eq('id', id)
  
  if(error){
    console.log(error.message)
    return `Erro ao excluir este acesso`
  }

  revalidatePath('/profile-admin')
}