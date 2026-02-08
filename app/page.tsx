'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRef } from 'react'
import { toast } from 'sonner'
import { createFuelRequest } from './actions/requests'

export default function HomePage() {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    const result = await createFuelRequest(formData)
    
    if (result.success) {
      toast.success('¡Solicitud enviada!', {
        description: 'El jefe recibirá un correo electrónico con los detalles.'
      })
      formRef.current?.reset()
    } else {
      toast.error('Error al enviar solicitud', {
        description: result.error
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Solicitud de Combustible</CardTitle>
            <CardDescription>
              Complete el formulario para solicitar combustible para camiones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="plateNumber">Placa del Vehículo</Label>
                <Input
                  type="text"
                  id="plateNumber"
                  name="plateNumber"
                  required
                  placeholder="Ej: ABC-123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workerName">Nombre del Trabajador</Label>
                <Input
                  type="text"
                  id="workerName"
                  name="workerName"
                  required
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workerDNI">DNI del Trabajador</Label>
                <Input
                  type="text"
                  id="workerDNI"
                  name="workerDNI"
                  required
                  placeholder="Ej: 12345678"
                  pattern="[0-9]{8}"
                  maxLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Monto Solicitado (Soles)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">S/</span>
                  <Input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    min="1"
                    step="0.01"
                    placeholder="200.00"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Enviar Solicitud
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <Link href="/requests">
                <Button variant="link" className="p-0 h-auto">
                  Ver mis solicitudes →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}