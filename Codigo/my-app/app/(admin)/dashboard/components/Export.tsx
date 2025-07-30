'use client';

// Shadcn
import { Button } from '@/components/ui/button'
// Icons
import { DownloadIcon } from 'lucide-react'

export const ExportarPDF = () => {

    const exportar = async () => {
        window.print()
    }

    return (
        <Button variant={'secondary'} onClick={exportar} size={'sm'}>
            <DownloadIcon />
            Exportar
        </Button>
    )
}