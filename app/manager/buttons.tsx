'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { updateRequestStatus } from '../actions/requests'

export function ApproveButton({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleApprove = () => {
    startTransition(async () => {
      const result = await updateRequestStatus(requestId, 'APPROVED')
      if (result.success) {
        toast.success('Solicitud aprobada', {
          description: 'El trabajador podrá proceder con la compra de combustible.'
        })
      } else {
        toast.error('Error al aprobar', {
          description: result.error
        })
      }
    })
  }

  return (
    <Button
      onClick={handleApprove}
      disabled={isPending}
      className="bg-green-600 hover:bg-green-700"
      size="lg"
    >
      <CheckCircle2 className="mr-2 h-5 w-5" />
      {isPending ? 'Aprobando...' : 'Aprobar'}
    </Button>
  )
}

export function RejectButton({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleReject = () => {
    startTransition(async () => {
      const result = await updateRequestStatus(requestId, 'REJECTED')
      if (result.success) {
        toast.error('Solicitud rechazada', {
          description: 'El trabajador será notificado del rechazo.'
        })
      } else {
        toast.error('Error al rechazar', {
          description: result.error
        })
      }
    })
  }

  return (
    <Button
      onClick={handleReject}
      disabled={isPending}
      variant="destructive"
      size="lg"
    >
      <XCircle className="mr-2 h-5 w-5" />
      {isPending ? 'Rechazando...' : 'Rechazar'}
    </Button>
  )
}