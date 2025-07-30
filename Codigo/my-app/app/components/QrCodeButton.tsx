'use client'

// Shadcn
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { QrCode } from "lucide-react"
import Image from "next/image"
type QrCodeButtonProps = {
  qr_code_token: string | null;
};
export const QrCodeButton = ({ qr_code_token }: QrCodeButtonProps) =>{
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className={'rounded-full'}>Visualizar QR Code <QrCode /></Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="text-center">QR Code do Produto</DrawerTitle>
                        <DrawerDescription className="text-center">Use este QR Code para retirar o produto.</DrawerDescription>
                    </DrawerHeader>
                    <Image
                        src={`https://quickchart.io/qr?text=${qr_code_token}`}
                        alt="QR Code"
                        width={200}
                        height={200}
                        unoptimized 
                        className="mx-auto"
                    />
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Fechar</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}