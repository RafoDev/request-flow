import { getRequests } from '../actions/requests'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { DownloadInvoiceButton } from './download-button'

export default async function RequestsPage() {
  const requests = await getRequests()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-500">Aprobada</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">Rechazada</Badge>
      case 'PENDING':
        return <Badge variant="secondary">Pendiente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Mis Solicitudes</CardTitle>
            <CardDescription>
              Historial de solicitudes de combustible
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No hay solicitudes registradas</p>
                <Link href="/">
                  <Button>Crear primera solicitud</Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trabajador</TableHead>
                      <TableHead>DNI</TableHead>
                      <TableHead>Placa</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Factura</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.workerName}
                        </TableCell>
                        <TableCell>{request.workerDNI}</TableCell>
                        <TableCell>{request.plateNumber}</TableCell>
                        <TableCell>S/ {request.amount.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {new Date(request.createdAt).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          {request.status === 'APPROVED' ? (
                            <DownloadInvoiceButton requestId={request.id} />
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="mt-6">
              <Link href="/">
                <Button variant="outline">← Volver al formulario</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}