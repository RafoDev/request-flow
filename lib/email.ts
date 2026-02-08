import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendRequestNotification(request: {
  id: string
  workerName: string
  workerDNI: string
  plateNumber: string
  amount: number
}) {
  try {
    await resend.emails.send({
      from: 'RequestFlow <onboarding@resend.dev>',
      to: process.env.MANAGER_EMAIL!,
      subject: `Nueva Solicitud de Combustible - ${request.workerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nueva Solicitud de Combustible</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Trabajador:</strong> ${request.workerName}</p>
            <p><strong>DNI:</strong> ${request.workerDNI}</p>
            <p><strong>Placa:</strong> ${request.plateNumber}</p>
            <p><strong>Monto:</strong> S/ ${request.amount.toFixed(2)}</p>
          </div>
          
          <p style="margin-top: 30px; color: #666;">
            Visita el panel de gestión: 
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/manager">
              Ver solicitudes
            </a>
          </p>
        </div>
      `
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}