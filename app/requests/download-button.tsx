'use client'

import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function DownloadInvoiceButton({ requestId }: { requestId: string }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    toast.loading('Generando factura...', { id: 'invoice-download' })

    try {
      const response = await fetch(`/api/invoice/${requestId}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al generar la factura')
      }

      // Obtener el blob del PDF
      const blob = await response.blob()
      
      // Crear un link temporal para descargar
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `factura-${requestId.substring(0, 8)}.pdf`
      document.body.appendChild(a)
      a.click()
      
      // Limpiar
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Factura descargada', { id: 'invoice-download' })
    } catch (error) {
      console.error('Error downloading invoice:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al descargar la factura',
        { id: 'invoice-download' }
      )
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button 
      size="sm" 
      variant="outline"
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generando...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Descargar
        </>
      )}
    </Button>
  )
}