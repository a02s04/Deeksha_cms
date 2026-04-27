import type { Payload } from 'payload'

import {
  PAYMENT_METHOD_LABELS,
  type EnquiryInterest,
  type PaymentMethod,
  type PaymentStatus,
} from '../constants/catalog.ts'
import type { ResolvedSiteSettings } from './site-settings'

type WishlistItemInput = {
  price?: number
  productID?: number | string
  productName?: string
  quantity?: number
}

type EnquiryInput = {
  customerCity?: string
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  interest?: EnquiryInterest | null
  items?: WishlistItemInput[]
  message?: string
}

type CartItemInput = {
  productID?: number | string
  quantity?: number
}

type CartCheckoutInput = {
  customerAddress?: string
  customerCity?: string
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  items: CartItemInput[]
  message?: string
  paymentMethod: PaymentMethod
}

type ResolvedOrderItem = {
  lineTotal: number
  price: number
  product?: number
  productName: string
  quantity: number
}

const MAX_CART_QUANTITY = 20

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    currency: 'INR',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)

const normalizeQuantity = (value: unknown) => {
  const quantity = Number(value) || 1
  return Math.min(MAX_CART_QUANTITY, Math.max(1, Math.round(quantity)))
}

const parseRecordID = (value: unknown) => {
  if (typeof value === 'number') {
    return value
  }

  const stringValue = String(value || '').trim()

  if (!stringValue) {
    return null
  }

  return /^\d+$/.test(stringValue) ? Number(stringValue) : stringValue
}

const sumLineTotals = (items: ResolvedOrderItem[]) =>
  items.reduce((sum, item) => sum + item.lineTotal, 0)

const mapLooseItemsToOrderItems = (items: WishlistItemInput[] = []): ResolvedOrderItem[] =>
  items.map((item) => {
    const quantity = normalizeQuantity(item.quantity)
    const price = Math.max(0, Number(item.price) || 0)
    const relationID = parseRecordID(item.productID)

    return {
      lineTotal: price * quantity,
      price,
      product: typeof relationID === 'number' ? relationID : undefined,
      productName: item.productName || 'Product',
      quantity,
    }
  })

const getInitialPaymentStatus = (paymentMethod: PaymentMethod): PaymentStatus =>
  paymentMethod === 'cash-on-delivery' ? 'pending' : 'awaiting-confirmation'

export const buildWhatsAppUrl = (whatsappNumber: string, message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

export const buildWishlistMessage = (items: WishlistItemInput[]) => {
  const lines = items.map((item, index) => {
    const quantity = normalizeQuantity(item.quantity)
    const price = typeof item.price === 'number' ? ` - ${formatPrice(item.price)}` : ''

    return `${index + 1}. ${item.productName || 'Product'} x${quantity}${price}`
  })

  return [
    'Hi! I am interested in the following items from your catalogue:',
    ...lines,
    '',
    'Please share availability and delivery details.',
  ].join('\n')
}

export const buildEnquiryMessage = (input: EnquiryInput) =>
  [
    'New Enquiry from Website',
    '',
    `Name: ${input.customerName || '-'}`,
    `Phone: ${input.customerPhone || '-'}`,
    `Email: ${input.customerEmail || '-'}`,
    `Interested in: ${input.interest || '-'}`,
    `City: ${input.customerCity || '-'}`,
    `Message: ${input.message || '-'}`,
  ].join('\n')

export const buildPaymentInstructions = (
  settings: ResolvedSiteSettings,
  paymentMethod: PaymentMethod,
  totalAmount: number,
  reference: string,
) => {
  const sharedNote = settings.paymentSettings.paymentInstructions

  if (paymentMethod === 'upi') {
    return [
      `Pay ${formatPrice(totalAmount)} via UPI to ${settings.paymentSettings.upiId}.`,
      `Use order reference ${reference} in the payment note or screenshot.`,
      sharedNote,
    ]
      .filter(Boolean)
      .join(' ')
  }

  if (paymentMethod === 'bank-transfer') {
    return [
      `Transfer ${formatPrice(totalAmount)} to ${settings.paymentSettings.bankAccountName}, ${settings.paymentSettings.bankName}, A/C ${settings.paymentSettings.bankAccountNumber}, IFSC ${settings.paymentSettings.bankIfsc}.`,
      `Mention order reference ${reference} in the transfer remark when possible.`,
      sharedNote,
    ]
      .filter(Boolean)
      .join(' ')
  }

  return [
    'Cash on delivery has been selected.',
    'Our team will confirm availability, delivery timeline, and any final charges before dispatch.',
    sharedNote,
  ]
    .filter(Boolean)
    .join(' ')
}

const buildCartCheckoutMessage = (
  reference: string,
  input: CartCheckoutInput,
  items: ResolvedOrderItem[],
  totalAmount: number,
) => {
  const lines = items.map(
    (item, index) =>
      `${index + 1}. ${item.productName} x${item.quantity} - ${formatPrice(item.lineTotal)}`,
  )

  return [
    'New Cart Checkout from Website',
    '',
    `Reference: ${reference}`,
    `Name: ${input.customerName || '-'}`,
    `Phone: ${input.customerPhone || '-'}`,
    `Email: ${input.customerEmail || '-'}`,
    `City: ${input.customerCity || '-'}`,
    `Address: ${input.customerAddress || '-'}`,
    `Payment Method: ${PAYMENT_METHOD_LABELS[input.paymentMethod]}`,
    `Total: ${formatPrice(totalAmount)}`,
    '',
    'Items:',
    ...lines,
    '',
    `Notes: ${input.message || '-'}`,
  ].join('\n')
}

export const upsertCustomer = async (
  payload: Payload,
  input: EnquiryInput,
) => {
  if (!input.customerName || !input.customerPhone) {
    return null
  }

  const existing = await payload.find({
    collection: 'customers',
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      phone: {
        equals: input.customerPhone,
      },
    },
  })

  const customerData = {
    city: input.customerCity || '',
    email: input.customerEmail || '',
    fullName: input.customerName,
    lastEnquiredAt: new Date().toISOString(),
    ...(input.interest ? { lastInterest: input.interest } : {}),
  }

  if (existing.docs[0]) {
    return payload.update({
      id: existing.docs[0].id,
      collection: 'customers',
      data: customerData,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'customers',
    data: {
      ...customerData,
      phone: input.customerPhone,
    },
    overrideAccess: true,
  })
}

const resolveCheckoutItems = async (
  payload: Payload,
  items: CartItemInput[],
): Promise<ResolvedOrderItem[]> => {
  const groupedItems = new Map<
    string,
    {
      quantity: number
      recordID: number | string
    }
  >()

  for (const item of items) {
    const recordID = parseRecordID(item.productID)

    if (!recordID) {
      continue
    }

    const mapKey = String(recordID)
    const quantity = normalizeQuantity(item.quantity)
    const existing = groupedItems.get(mapKey)

    groupedItems.set(mapKey, {
      quantity: Math.min(
        MAX_CART_QUANTITY,
        (existing?.quantity || 0) + quantity,
      ),
      recordID,
    })
  }

  const ids = [...groupedItems.values()].map((item) => item.recordID)

  if (!ids.length) {
    return []
  }

  const products = await payload.find({
    collection: 'products',
    depth: 0,
    limit: ids.length,
    overrideAccess: true,
    pagination: false,
    where: {
      id: {
        in: ids,
      },
    },
  })

  const productMap = new Map(products.docs.map((product) => [String(product.id), product]))

  return [...groupedItems.entries()].flatMap(([key, value]) => {
    const product = productMap.get(key)

    if (!product) {
      return []
    }

    const price = Math.max(0, Number(product.price) || 0)

    return [
      {
        lineTotal: price * value.quantity,
        price,
        product: product.id,
        productName: product.name,
        quantity: value.quantity,
      },
    ]
  })
}

export const buildOrderReference = (prefix: string) => {
  const timestamp = Date.now().toString(36).toUpperCase()
  return `${prefix}-${timestamp}`
}

export const createEnquiryOrder = async (
  payload: Payload,
  settings: ResolvedSiteSettings,
  input: EnquiryInput,
) => {
  const customer = await upsertCustomer(payload, input)
  const items = mapLooseItemsToOrderItems(input.items)
  const subtotal = sumLineTotals(items)
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber,
    buildEnquiryMessage(input),
  )
  const interest = input.interest ?? undefined

  const order = await payload.create({
    collection: 'orders',
    data: {
      currency: 'INR',
      customer: customer?.id,
      customerCity: input.customerCity || '',
      customerEmail: input.customerEmail || '',
      customerName: input.customerName || '',
      customerPhone: input.customerPhone || '',
      ...(interest ? { interest } : {}),
      items,
      message: input.message || '',
      orderType: 'enquiry',
      reference: buildOrderReference('ENQ'),
      source: 'website',
      status: 'new',
      subtotal,
      submittedAt: new Date().toISOString(),
      totalAmount: subtotal,
      whatsappUrl,
    },
    overrideAccess: true,
  })

  return {
    order,
    whatsappUrl,
  }
}

export const createWishlistOrder = async (
  payload: Payload,
  settings: ResolvedSiteSettings,
  items: WishlistItemInput[],
) => {
  const mappedItems = mapLooseItemsToOrderItems(items)
  const subtotal = sumLineTotals(mappedItems)
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber,
    buildWishlistMessage(items),
  )

  const order = await payload.create({
    collection: 'orders',
    data: {
      currency: 'INR',
      items: mappedItems,
      orderType: 'wishlist',
      reference: buildOrderReference('WIS'),
      source: 'website',
      status: 'new',
      subtotal,
      submittedAt: new Date().toISOString(),
      totalAmount: subtotal,
      whatsappUrl,
    },
    overrideAccess: true,
  })

  return {
    order,
    whatsappUrl,
  }
}

export const createCartOrder = async (
  payload: Payload,
  settings: ResolvedSiteSettings,
  input: CartCheckoutInput,
) => {
  const items = await resolveCheckoutItems(payload, input.items)

  if (!items.length) {
    throw new Error('Cart does not contain any valid products.')
  }

  const reference = buildOrderReference('ORD')
  const subtotal = sumLineTotals(items)
  const paymentStatus = getInitialPaymentStatus(input.paymentMethod)
  const paymentInstructions = buildPaymentInstructions(
    settings,
    input.paymentMethod,
    subtotal,
    reference,
  )
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber,
    buildCartCheckoutMessage(reference, input, items, subtotal),
  )
  const customer = await upsertCustomer(payload, {
    customerCity: input.customerCity,
    customerEmail: input.customerEmail,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
  })
  const submittedAt = new Date().toISOString()

  const order = await payload.create({
    collection: 'orders',
    data: {
      currency: 'INR',
      customer: customer?.id,
      customerAddress: input.customerAddress || '',
      customerCity: input.customerCity || '',
      customerEmail: input.customerEmail || '',
      customerName: input.customerName || '',
      customerPhone: input.customerPhone || '',
      items,
      message: input.message || '',
      orderType: 'cart',
      paymentMethod: input.paymentMethod,
      paymentNotes: paymentInstructions,
      paymentStatus,
      reference,
      source: 'website',
      status:
        input.paymentMethod === 'cash-on-delivery'
          ? 'confirmed'
          : 'pending-payment',
      subtotal,
      submittedAt,
      totalAmount: subtotal,
      whatsappUrl,
    },
    overrideAccess: true,
  })

  if (customer?.id) {
    await payload.update({
      id: customer.id,
      collection: 'customers',
      data: {
        lastOrderAt: submittedAt,
        lastOrderReference: reference,
        lastOrderType: 'cart',
        lastPaymentMethod: input.paymentMethod,
        lastPaymentStatus: paymentStatus,
        totalOrders: Math.max(0, Number(customer.totalOrders) || 0) + 1,
        totalSpend: Math.max(0, Number(customer.totalSpend) || 0) + subtotal,
      },
      overrideAccess: true,
    })
  }

  return {
    order,
    paymentInstructions,
    paymentMethodLabel: PAYMENT_METHOD_LABELS[input.paymentMethod],
    whatsappUrl,
  }
}
