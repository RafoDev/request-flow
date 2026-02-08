import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/manager?error=invalid-token', request.url))
  }

  try {
    const fuelRequest = await db.fuelRequest.findUnique({
      where: { approvalToken: token }
    })

    if (!fuelRequest) {
      return NextResponse.redirect(new URL('/manager?error=not-found', request.url))
    }

    if (fuelRequest.status !== 'PENDING') {
      return NextResponse.redirect(new URL('/manager?error=already-processed', request.url))
    }

    await db.fuelRequest.update({
      where: { id: fuelRequest.id },
      data: { 
        status: 'REJECTED',
        approvalToken: null
      }
    })

    return NextResponse.redirect(new URL('/manager?success=rejected', request.url))
  } catch (error) {
    console.error('Error rejecting request:', error)
    return NextResponse.redirect(new URL('/manager?error=server-error', request.url))
  }
}