import { NextResponse } from 'next/server'

import {
  ENQUIRY_INTEREST_VALUES,
  type EnquiryInterest,
} from '../../../src/constants/catalog.ts'
import { createEnquiryOrder } from '../../../src/lib/orders'
import { getPayloadClient } from '../../../src/lib/payload'
import { resolveSiteSettings } from '../../../src/lib/site-settings'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const customerName = String(body.customerName || '').trim()
    const customerPhone = String(body.customerPhone || '').trim()
    const customerCity = String(body.customerCity || '').trim()
    const customerEmail = String(body.customerEmail || '').trim()
    const rawInterest = String(body.interest || '').trim()
    const interest = ENQUIRY_INTEREST_VALUES.includes(rawInterest as EnquiryInterest)
      ? (rawInterest as EnquiryInterest)
      : null
    const message = String(body.message || '').trim()

    if (!customerName || !customerPhone || !customerCity || !interest) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please complete all required fields before submitting.',
        },
        { status: 400 },
      )
    }

    const payload = await getPayloadClient()
    const siteSettings = await resolveSiteSettings(payload)
    const result = await createEnquiryOrder(payload, siteSettings, {
      customerCity,
      customerEmail,
      customerName,
      customerPhone,
      interest,
      items: Array.isArray(body.items) ? body.items : [],
      message,
    })

    return NextResponse.json({
      success: true,
      orderID: result.order.id,
      whatsappUrl: result.whatsappUrl,
    })
  } catch (error) {
    console.error('[submit-order]', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Unable to submit your enquiry right now.',
      },
      { status: 500 },
    )
  }
}
