'use client'

// Shadcn
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog"
// React
import { useEffect, useState, useTransition } from "react"
// Icons
import { Upload } from "lucide-react"
// Actions
import { uploadBanner } from "./actions/uploadBanner"
import { CircularProgress } from "@/app/components/CircularProgress"
// Libs
import { toast } from "sonner"

type Props = {
    token_evento: string
}

export const UploadBanner = ({token_evento}: Props) => {

    const [open, setOpen] = useState(false)

    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [image, setImage] = useState<ArrayBuffer | null>(null)

    const [pending, startTransition] = useTransition()

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(!event.target.files){
            return 
        }
        const file = event.target.files[0]

        if (file) {
            // FileReader for Base64 preview
            const reader1 = new FileReader()
            reader1.onloadend = () => {
                if(typeof reader1.result === 'string'){
                    setImagePreview(reader1.result)
                    console.log(reader1.result)
                }
            }
            reader1.readAsDataURL(file)
    
            // FileReader for ArrayBuffer
            const reader2 = new FileReader()
            reader2.onloadend = () => {
                if(reader2.result instanceof ArrayBuffer){
                    setImage(reader2.result)
                    console.log(reader2.result)
                }
            }
            reader2.readAsArrayBuffer(file)
        }
    }

    const uploadBannerCallback = ()=> {
        if(image instanceof ArrayBuffer){
            if(new Blob([image]).size > (4 * 1024 * 1024)){
                return toast.warning('O arquivo não pode ser maior que 4MB')
            }
            startTransition(async()=> {
                const res = await uploadBanner(image, token_evento)
                if(res){
                    toast.warning(res)
                }
                setImagePreview(null)
                setImage(null)
            })
        }else{
            toast.warning('Escolha uma imagem')
        }
    }

    useEffect(() => {
        if (!pending) {
            setOpen(false)
        }
    }, [pending])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className={'mt-1 mb-4'}
                    size={'sm'}>
                    Novo Banner
                    <Upload size={20} />
                </Button>
            </DialogTrigger>
            <DialogContent className={'w-5/6 max-w-[600px] rounded-md'}>
                <DialogHeader>
                    <DialogTitle>Novo Banner</DialogTitle>
                    <DialogDescription>
                        Faça o upload de uma imagem.
                    </DialogDescription>
                </DialogHeader>

                <Input
                    onChange={handleFileChange as ((event: {target: {name: string;value: string}}) => void) | undefined}
                    accept="image/*"
                    required
                    name={'file'}
                    type={'file'} className={'text-xs'} />
                    
                {imagePreview && (
                    <img src={String(imagePreview)}
                        alt="Prévia da imagem"
                        className="mt-4 mx-auto max-h-48 object-cover rounded-md"
                    />
                )}
                <div className={'flex justify-end mt-2'}>
                    <Button 
                        disabled={pending}
                        onClick={uploadBannerCallback}>
                        {pending ? 
                            <CircularProgress/> 
                        : 
                        <>
                            Atualizar
                            <Upload />
                        </>}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}