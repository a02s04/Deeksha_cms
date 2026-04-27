export const PRODUCT_CATEGORY_VALUES = [
  'Beds',
  'Sofas',
  'Dining Tables',
  'Coffee & Side Tables',
  'Chairs',
  'Study Desks',
  'Wardrobes & Almirahs',
  'Mirrors & Dressing Tables',
  'Benches',
  'Shoe & Luggage Racks',
  'Lamps',
  'Custom Orders',
 ] as const

export const PRODUCT_CATEGORY_OPTIONS = PRODUCT_CATEGORY_VALUES.map((value) => ({
  label: value,
  value,
}))

export const WOOD_TYPE_VALUES = [
  'Sheesham',
  'Teak',
  'Mango Wood',
  'Pine',
  'Walnut',
  'Oak',
  'Ash',
  'Custom',
] as const

export const WOOD_TYPE_OPTIONS = WOOD_TYPE_VALUES.map((value) => ({
  label: value,
  value,
}))

export const PORTFOLIO_CATEGORY_OPTIONS = [
  { label: 'Living Room', value: 'living-room' },
  { label: 'Bedroom', value: 'bedroom' },
  { label: 'Dining', value: 'dining' },
  { label: 'Office', value: 'office' },
  { label: 'Custom', value: 'custom' },
]

export const ENQUIRY_INTEREST_VALUES = [
  'Beds',
  'Sofas',
  'Dining Tables',
  'Coffee & Side Tables',
  'Chairs',
  'Study Desks',
  'Wardrobes & Almirahs',
  'Mirrors & Dressing Tables',
  'Benches',
  'Shoe & Luggage Racks',
  'Lamps',
  'Multiple Items',
  'Custom Order',
] as const

export type EnquiryInterest = (typeof ENQUIRY_INTEREST_VALUES)[number]

export const ENQUIRY_INTEREST_OPTIONS = ENQUIRY_INTEREST_VALUES.map((value) => ({
  label: value,
  value,
}))

export const ORDER_TYPE_VALUES = ['enquiry', 'wishlist', 'cart'] as const

export type OrderType = (typeof ORDER_TYPE_VALUES)[number]

export const ORDER_TYPE_OPTIONS = ORDER_TYPE_VALUES.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}))

export const ORDER_STATUS_VALUES = [
  'new',
  'contacted',
  'quoted',
  'pending-payment',
  'confirmed',
  'processing',
  'completed',
  'cancelled',
  'converted',
  'closed',
] as const

export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number]

export const ORDER_STATUS_OPTIONS = ORDER_STATUS_VALUES.map((value) => ({
  label: value
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' '),
  value,
}))

export const PAYMENT_METHOD_VALUES = [
  'upi',
  'bank-transfer',
  'cash-on-delivery',
] as const

export type PaymentMethod = (typeof PAYMENT_METHOD_VALUES)[number]

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  'bank-transfer': 'Bank Transfer',
  'cash-on-delivery': 'Cash on Delivery',
  upi: 'UPI',
}

export const PAYMENT_METHOD_OPTIONS = PAYMENT_METHOD_VALUES.map((value) => ({
  label: PAYMENT_METHOD_LABELS[value],
  value,
}))

export const PAYMENT_STATUS_VALUES = [
  'pending',
  'awaiting-confirmation',
  'paid',
  'failed',
  'refunded',
] as const

export type PaymentStatus = (typeof PAYMENT_STATUS_VALUES)[number]

export const PAYMENT_STATUS_OPTIONS = PAYMENT_STATUS_VALUES.map((value) => ({
  label: value
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' '),
  value,
}))
