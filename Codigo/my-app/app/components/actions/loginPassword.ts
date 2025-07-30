'use server';

// Supabase
import { createClient } from "@/utils/supabase/server"
// Validation
import { login_validation } from "@/validation/login"
// Next
import { redirect } from "next/navigation"
// Libs
import { z } from "zod"

export const loginPassword = async (data: z.infer<typeof login_validation>) => {

  const supabase = await createClient()
  
  const { data: user, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  })
  
  if(error){
    console.log(error.message)
    return `Erro ao realizar o login. - ${error.message}`
  }

  if (user) {
    
    if(user.user?.app_metadata.provider === 'google'){
        redirect('/profile')
    }else{
        redirect('/dashboard')
    }
  }
  
}