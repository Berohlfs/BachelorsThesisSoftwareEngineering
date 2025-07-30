'use server'

// Supabase
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
// Libs
import { v4 as uuidv4 } from 'uuid'
import sharp from "sharp"

export const uploadPicture = async(file: ArrayBuffer, token_produto: string)=> {

    const error_message = 'Erro ao realizar o upload.'

    const buffer = Buffer.from(file)

    const webpBuffer = await sharp(buffer).resize({ width: 400, height: 300, fit: "inside" }).webp({ quality: 80 }).toBuffer()

    const webpBlob = new Blob([webpBuffer], { type: "image/webp" })

    const file_name = uuidv4()

    const webpFile = new File([webpBlob], `${file_name}.webp`, { type: "image/webp" })

    const supabase = await createClient()

    // Find produto
    const produto = await supabase.from('products').select().eq('token', token_produto).single()

    if(produto.error){
        console.log(produto.error?.message)
        return error_message
    }

    // Upload new and delete old
    const upload = await supabase.storage.from('products').upload(file_name, webpFile)

    if(upload.error){
        console.log(upload.error?.message)
        return error_message
    }

    if(produto.data.image_bucket_ref){
        const remove = await supabase.storage.from('products').remove([produto.data.image_bucket_ref])
        if(remove.error?.message){
            console.log(remove.error?.message)
        }
    }
    
    const produto_atualizado = await supabase.from('products').update({
        image_bucket_ref: upload.data.path
    }).eq('id', produto.data.id)

    if(produto_atualizado.error){
        console.log(produto_atualizado.error?.message)
        return error_message
    }
    
    revalidatePath('/meus-produtos/[token]', 'page')
}