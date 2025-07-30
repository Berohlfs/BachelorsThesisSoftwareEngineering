'use server'

// Supabase
import { createClient } from "@/utils/supabase/server"
// Next
import { redirect } from "next/navigation"

export const logout = async()=> {
    const supabase = await createClient()

    await supabase.auth.signOut()

    return redirect('/')
}