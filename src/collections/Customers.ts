import type { CollectionConfig } from 'payload'

import {
  ORDER_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from '../constants/catalog.ts'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'fullName',
    group: 'Sales',
    defaultColumns: ['fullName', 'phone', 'city', 'totalOrders', 'totalSpend', 'updatedAt'],
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'lastInterest',
      type: 'text',
    },
    {
      name: 'lastOrderType',
      type: 'select',
      options: ORDER_TYPE_OPTIONS,
    },
    {
      name: 'lastOrderReference',
      type: 'text',
    },
    {
      name: 'lastPaymentMethod',
      type: 'select',
      options: PAYMENT_METHOD_OPTIONS,
    },
    {
      name: 'lastPaymentStatus',
      type: 'select',
      options: PAYMENT_STATUS_OPTIONS,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'lastEnquiredAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'lastOrderAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'totalOrders',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'totalSpend',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
  ],
}
