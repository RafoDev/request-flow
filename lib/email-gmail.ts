import nodemailer from 'nodemailer'

// Configurar transporter de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendRequestNotificationGmail(
  request: {
    id: string
    workerName: string
    workerDNI: string
    plateNumber: string
    amount: number
    approvalToken: string | null
  },
  recipientEmail: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const approveUrl = `${baseUrl}/api/approve?token=${request.approvalToken}`
  const rejectUrl = `${baseUrl}/api/reject?token=${request.approvalToken}`

  try {
    const info = await transporter.sendMail({
      from: `"RequestFlow" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: `Nueva Solicitud de Combustible - ${request.workerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nueva Solicitud de Combustible</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Trabajador:</strong> ${request.workerName}</p>
            <p style="margin: 8px 0;"><strong>DNI:</strong> ${request.workerDNI}</p>
            <p style="margin: 8px 0;"><strong>Placa:</strong> ${request.plateNumber}</p>
            <p style="margin: 8px 0;"><strong>Monto:</strong> S/ ${request.amount.toFixed(2)}</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="${approveUrl}" 
               style="background: #22c55e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 8px; font-weight: bold;">
              ✓ Aprobar Solicitud
            </a>
            
            <a href="${rejectUrl}" 
               style="background: #ef4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 8px; font-weight: bold;">
              ✗ Rechazar Solicitud
            </a>
          </div>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px; text-align: center;">
            O visita el panel de gestión: 
            <a href="${baseUrl}/manager" style="color: #3b82f6;">
              Ver todas las solicitudes
            </a>
          </p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('❌ Error enviando email:', error)
    return { success: false, error }
  }
}