import { NextResponse } from 'next/server'

import {
  PAYMENT_METHOD_VALUES,
  type PaymentMethod,
} from '../../../src/constants/catalog.ts'
import { createCartOrder } from '../../../src/lib/orders'
import { getPayloadClient } from '../../../src/lib/payload'
import {
  getEnabledPaymentMethods,
  resolveSiteSettings,
} from '../../../src/lib/site-settings'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const customerName = String(body.customerName || '').trim()
    const customerPhone = String(body.customerPhone || '').trim()
    const customerEmail = String(body.customerEmail || '').trim()
    const customerCity = String(body.customerCity || '').trim()
    const customerAddress = String(body.customerAddress || '').trim()
    const message = String(body.message || '').trim()
    const rawPaymentMethod = String(body.paymentMethod || '').trim()
    const paymentMethod = PAYMENT_METHOD_VALUES.includes(rawPaymentMethod as PaymentMethod)
      ? (rawPaymentMethod as PaymentMethod)
      : null
    const items = Array.isArray(body.items) ? body.items : []

    if (!customerName || !customerPhone || !customerCity || !customerAddress || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please complete your checkout details before placing the order.',
        },
        { status: 400 },
      )
    }

    if (!items.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Your cart is empty.',
        },
        { status: 400 },
      )
    }

    const payload = await getPayloadClient()
    const siteSettings = await resolveSiteSettings(payload)
    const enabledPaymentMethods = getEnabledPaymentMethods(siteSettings)

    if (!enabledPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          error: 'That payment method is not available right now.',
        },
        { status: 400 },
      )
    }

    const result = await createCartOrder(payload, siteSettings, {
      customerAddress,
      customerCity,
      customerEmail,
      customerName,
      customerPhone,
      items,
      message,
      paymentMethod,
    })

    return NextResponse.json({
      success: true,
      orderID: result.order.id,
      orderReference: result.order.reference,
      paymentInstructions: result.paymentInstructions,
      paymentMethodLabel: result.paymentMethodLabel,
      totalAmount: result.order.totalAmount,
      whatsappUrl: result.whatsappUrl,
    })
  } catch (error) {
    console.error('[submit-cart]', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Unable to place your order right now.',
      },
      { status: 500 },
    )
  }
}
