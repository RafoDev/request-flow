import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/manager?error=invalid-token', request.url))
  }

  try {
    // Buscar la solicitud por token
    const fuelRequest = await db.fuelRequest.findUnique({
      where: { approvalToken: token }
    })

    if (!fuelRequest) {
      return NextResponse.redirect(new URL('/manager?error=not-found', request.url))
    }

    if (fuelRequest.status !== 'PENDING') {
      return NextResponse.redirect(new URL('/manager?error=already-processed', request.url))
    }

    // Aprobar la solicitud
    await db.fuelRequest.update({
      where: { id: fuelRequest.id },
      data: { 
        status: 'APPROVED',
        approvalToken: null // Invalidar el token
      }
    })

    return NextResponse.redirect(new URL('/manager?success=approved', request.url))
  } catch (error) {
    console.error('Error approving request:', error)
    return NextResponse.redirect(new URL('/manager?error=server-error', request.url))
  }
}