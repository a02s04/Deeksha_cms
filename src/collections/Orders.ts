import type { CollectionConfig } from 'payload'

import {
  ENQUIRY_INTEREST_OPTIONS,
  ORDER_STATUS_OPTIONS,
  ORDER_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from '../constants/catalog.ts'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'reference',
    group: 'Sales',
    defaultColumns: [
      'reference',
      'orderType',
      'customerName',
      'totalAmount',
      'paymentStatus',
      'status',
      'submittedAt',
    ],
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (!data && !originalDoc) {
          return data
        }

        const rawItems = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(originalDoc?.items)
            ? originalDoc.items
            : []

        const items = rawItems.map((item) => {
          const quantity = Math.max(1, Number(item?.quantity) || 1)
          const price = Math.max(0, Number(item?.price) || 0)

          return {
            ...item,
            lineTotal: quantity * price,
            price,
            quantity,
          }
        })

        const subtotal = items.reduce(
          (sum, item) => sum + (Number(item.lineTotal) || 0),
          0,
        )
        const deliveryCharge =
          data?.deliveryCharge ?? originalDoc?.deliveryCharge ?? 0
        const totalAmount = subtotal + Math.max(0, Number(deliveryCharge) || 0)

        return {
          ...data,
          currency: data?.currency ?? originalDoc?.currency ?? 'INR',
          items,
          subtotal,
          totalAmount,
        }
      },
    ],
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'orderType',
      type: 'select',
      required: true,
      defaultValue: 'enquiry',
      options: ORDER_TYPE_OPTIONS,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: ORDER_STATUS_OPTIONS,
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'website',
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Admin', value: 'admin' },
        { label: 'WhatsApp', value: 'whatsapp' },
      ],
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
    },
    {
      name: 'customerName',
      type: 'text',
    },
    {
      name: 'customerPhone',
      type: 'text',
    },
    {
      name: 'customerEmail',
      type: 'email',
    },
    {
      name: 'customerCity',
      type: 'text',
    },
    {
      name: 'customerAddress',
      type: 'textarea',
    },
    {
      name: 'interest',
      type: 'select',
      options: ENQUIRY_INTEREST_OPTIONS,
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
        },
        {
          name: 'productName',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          defaultValue: 1,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          label: 'Unit Price',
          min: 0,
        },
        {
          name: 'lineTotal',
          type: 'number',
          admin: {
            description: 'Calculated automatically from quantity x unit price.',
          },
          min: 0,
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      min: 0,
      admin: {
        description: 'Calculated from the line items.',
      },
    },
    {
      name: 'deliveryCharge',
      type: 'number',
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'totalAmount',
      type: 'number',
      min: 0,
      admin: {
        description: 'Subtotal plus delivery charges.',
      },
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'INR',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: PAYMENT_METHOD_OPTIONS,
    },
    {
      name: 'paymentStatus',
      type: 'select',
      options: PAYMENT_STATUS_OPTIONS,
    },
    {
      name: 'paymentReference',
      type: 'text',
    },
    {
      name: 'paymentNotes',
      type: 'textarea',
    },
    {
      name: 'paymentCapturedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'businessNotes',
      type: 'textarea',
    },
    {
      name: 'whatsappUrl',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
