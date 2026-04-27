import { NextResponse } from 'next/server'

import { buildWhatsAppUrl, createWishlistOrder } from '../../../src/lib/orders'
import { getPayloadClient } from '../../../src/lib/payload'
import { resolveSiteSettings } from '../../../src/lib/site-settings'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body.items) ? body.items : []

    const payload = await getPayloadClient()
    const siteSettings = await resolveSiteSettings(payload)

    if (!items.length) {
      return NextResponse.json({
        success: true,
        whatsappUrl: buildWhatsAppUrl(
          siteSettings.whatsappNumber,
          'Hi! I would like to discuss a furniture enquiry.',
        ),
      })
    }

    const result = await createWishlistOrder(payload, siteSettings, items)

    return NextResponse.json({
      success: true,
      orderID: result.order.id,
      whatsappUrl: result.whatsappUrl,
    })
  } catch (error) {
    console.error('[submit-wishlist]', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Unable to prepare your wishlist right now.',
      },
      { status: 500 },
    )
  }
}
