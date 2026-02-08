import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateInvoicePDF, generateInvoiceNumber } from '@/lib/generate-invoice'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params
    
    // Buscar la solicitud
    const fuelRequest = await db.fuelRequest.findUnique({
      where: { id: requestId }
    })

    if (!fuelRequest) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    if (fuelRequest.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Solo se pueden generar facturas de solicitudes aprobadas' }, { status: 400 })
    }

    // Generar número de factura basado en el ID
    const invoiceNumber = generateInvoiceNumber(fuelRequest.id)

    // Generar PDF en memoria
    const pdfBuffer = await generateInvoicePDF({
      invoiceNumber,
      requestId: fuelRequest.id,
      workerName: fuelRequest.workerName,
      workerDNI: fuelRequest.workerDNI,
      plateNumber: fuelRequest.plateNumber,
      amount: fuelRequest.amount,
      createdAt: fuelRequest.createdAt,
      approvedAt: fuelRequest.approvedAt || new Date(),
    })

    // Convertir Buffer a Uint8Array para Next.js
    const uint8Array = new Uint8Array(pdfBuffer)

    // Retornar el PDF directamente
    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="factura-${invoiceNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({ error: 'Error al generar la factura' }, { status: 500 })
  }
}