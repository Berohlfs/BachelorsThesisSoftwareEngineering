'use client';

// Shadcn
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
// Icons
import { Download, QrCode } from "lucide-react"
// React
import { useEffect, useState } from "react"

type Props = {
    cardapio_token: string
    large?: true
}

export const QRCodeModal = ({ cardapio_token, large }: Props) => {

    const [source, setSource] = useState<string | null>(null)

    useEffect(() => {
        setSource(`https://quickchart.io/qr?text=${window.location.protocol}//${window.location.host}/cardapio/${cardapio_token}`)
    }, [])

    const baixarImagem = async () => {
        try {
            if (source) {
                // Fetch the image
                const response = await fetch(source)
                const blob = await response.blob()

                // Create a download link
                const link = document.createElement("a")
                link.href = URL.createObjectURL(blob)
                link.download = "qr-code.jpg"
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

                URL.revokeObjectURL(link.href)
            }

        } catch (error) {
            console.error("Error downloading image:", error)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className={`ml-1`}
                    variant={'outline'}
                    size={large ? 'sm' : 'icon'}>
                    {large && 'QR Code do cardápio'} <QrCode />
                </Button>
            </DialogTrigger>
            <DialogContent className={'w-5/6 max-w-[600px] rounded-md'}>
                <DialogHeader>
                    <DialogTitle>QR Code do cardápio do evento</DialogTitle>

                    <div className={'h-5'}></div>

                    {source && <>
                        <img
                            className={'w-48 mx-auto rounded-lg'}
                            src={source} alt="QR Code" />

                        {large &&
                            <div className={'flex justify-end pt-5'}>
                                <Button onClick={baixarImagem}>
                                    Baixar imagem
                                    <Download />
                                </Button>
                            </div>}

                    </>}

                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}