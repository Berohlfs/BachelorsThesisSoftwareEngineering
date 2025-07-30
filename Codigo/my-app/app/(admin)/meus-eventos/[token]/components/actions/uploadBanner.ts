'use server'

// Supabase
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
// Libs
import { v4 as uuidv4 } from 'uuid'
import sharp from "sharp"

export const uploadBanner = async(file: ArrayBuffer, token_evento: string)=> {

    const error_message = 'Erro ao realizar o upload.'

    const buffer = Buffer.from(file)

    const webpBuffer = await sharp(buffer).resize({ width: 400, height: 300, fit: "inside" }).webp({ quality: 80 }).toBuffer()

    const webpBlob = new Blob([webpBuffer], { type: "image/webp" })

    const file_name = uuidv4()

    const webpFile = new File([webpBlob], `${file_name}.webp`, { type: "image/webp" })

    const supabase = await createClient()

    // Find evento
    const evento = await supabase.from('events').select().eq('token', token_evento).single()

    if(evento.error){
        console.log(evento.error?.message)
        return error_message
    }

    // Upload new and delete old
    const upload = await supabase.storage.from('banners').upload(file_name, webpFile)

    if(upload.error){
        console.log(upload.error?.message)
        return error_message
    }

    if(evento.data.image_bucket_ref){
        const remove = await supabase.storage.from('banners').remove([evento.data.image_bucket_ref])
        if(remove.error?.message){
            console.log(remove.error?.message)
        }
    }
    
    const evento_atualizado = await supabase.from('events').update({
        image_bucket_ref: upload.data.path
    }).eq('id', evento.data.id)

    if(evento_atualizado.error){
        console.log(evento_atualizado.error?.message)
        return error_message
    }
    
    revalidatePath('/meus-eventos/[token]', 'page')
}