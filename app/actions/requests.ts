'use server'

import { db } from '@/lib/db'
import { sendRequestNotification } from '@/lib/email'
import { revalidatePath } from 'next/cache'

export async function createFuelRequest(formData: FormData) {
  try {
    const plateNumber = formData.get('plateNumber') as string
    const workerName = formData.get('workerName') as string
    const workerDNI = formData.get('workerDNI') as string
    const amount = parseFloat(formData.get('amount') as string)

    if (!plateNumber || !workerName || !workerDNI || !amount) {
      return { error: 'Todos los campos son requeridos' }
    }

    if (amount <= 0) {
      return { error: 'El monto debe ser mayor a 0' }
    }

    const request = await db.fuelRequest.create({
      data: {
        plateNumber,
        workerName,
        workerDNI,
        amount,
      }
    })

    await sendRequestNotification(request)

    revalidatePath('/requests')
    
    return { 
      success: true, 
      message: 'Solicitud enviada correctamente',
      requestId: request.id 
    }
  } catch (error) {
    console.error('Error creating request:', error)
    return { error: 'Error al crear la solicitud' }
  }
}

export async function updateRequestStatus(
  requestId: string, 
  status: 'APPROVED' | 'REJECTED'
) {
  try {
    await db.fuelRequest.update({
      where: { id: requestId },
      data: { status }
    })

    revalidatePath('/manager')
    revalidatePath('/requests')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating request:', error)
    return { error: 'Error al actualizar la solicitud' }
  }
}

export async function getRequests() {
  try {
    const requests = await db.fuelRequest.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return requests
  } catch (error) {
    console.error('Error fetching requests:', error)
    return []
  }
}