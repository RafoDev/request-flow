
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getRequests } from '../actions/requests'
import { ApproveButton, RejectButton } from './buttons'

export default async function ManagerPage() {
  const requests = await getRequests()
  const pendingRequests = requests.filter(r => r.status === 'PENDING')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-500">✓ Aprobada</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">✗ Rechazada</Badge>
      case 'PENDING':
        return <Badge variant="secondary">⏱ Pendiente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Panel de Gestión</CardTitle>
            <CardDescription>
              {pendingRequests.length} solicitudes pendientes de revisión
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No hay solicitudes registradas</p>
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl">
                        {request.workerName}
                      </CardTitle>
                      <CardDescription>
                        Solicitud creada el {new Date(request.createdAt).toLocaleString('es-PE', {
                          dateStyle: 'long',
                          timeStyle: 'short'
                        })}
                      </CardDescription>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">DNI</p>
                      <p className="text-lg font-semibold">{request.workerDNI}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Placa del Vehículo</p>
                      <p className="text-lg font-semibold">{request.plateNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Monto Solicitado</p>
                      <p className="text-2xl font-bold text-primary">
                        S/ {request.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {request.status === 'PENDING' && (
                    <>
                      <Separator className="my-6" />
                      <div className="flex gap-3">
                        <ApproveButton requestId={request.id} />
                        <RejectButton requestId={request.id} />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}