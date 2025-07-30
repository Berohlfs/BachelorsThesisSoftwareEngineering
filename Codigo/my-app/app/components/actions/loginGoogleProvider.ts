'use server';

// Supabase
import { createClient } from "@/utils/supabase/server"
// Next
import { redirect } from "next/navigation"
// Utils
import { cardapio_regex } from "@/utils/supabase/middleware"

export const loginGoogleProvider = async (custom_redirect_url?: string) => {

  const supabase = await createClient()

  const handleCustomRedirectURL = ()=> {
    if(custom_redirect_url && cardapio_regex.test(custom_redirect_url)){
      return true
    }else{
      return false
    }
  }

  const { data, /*error*/ } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: process.env.CALLBACK_URL_GOOGLE + (handleCustomRedirectURL() ? `?next=${custom_redirect_url}` : '')
    }
  })

  if (data.url) {
    redirect(data.url)
  }
}