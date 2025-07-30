'use server';

// Supabase
import { createClient } from "@/utils/supabase/server"
// Validation
import { register_validation } from "@/validation/register"
// Next
import { redirect } from "next/navigation"
// Libs
import { z } from "zod"

export const registerPassword = async (data: z.infer<typeof register_validation>) => {

    const supabase = await createClient()

    const { data: user, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                role: 'admin', // stored in user_metadata
            }
        }
    })

    if (error) {
        console.log(error.message)
        return `Erro ao realizar o cadastro. - ${error.message}`
    }

    if (user) {
        if (user.user?.user_metadata.role !== 'admin') {
            redirect('/profile')
        } else {
            redirect('/dashboard')
        }
    }
}