import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'whatsappNumber',
      type: 'text',
      required: true,
      defaultValue: process.env.WHATSAPP_NUMBER || '919876543210',
    },
    {
      name: 'displayPhone',
      type: 'text',
      required: true,
      defaultValue: process.env.DISPLAY_PHONE || '+91 98765 43210',
    },
    {
      name: 'contactEmail',
      type: 'email',
      required: true,
      defaultValue: process.env.CONTACT_EMAIL || 'hello@mdlhandicrafts.in',
    },
    {
      name: 'instagramUrl',
      type: 'text',
      required: true,
      defaultValue: process.env.INSTAGRAM_URL || 'https://instagram.com/mdl_handicrafts',
    },
    {
      name: 'instagramHandle',
      type: 'text',
      required: true,
      defaultValue: process.env.INSTAGRAM_HANDLE || '@mdl_handicrafts',
    },
    {
      name: 'workshopAddress',
      type: 'textarea',
      required: true,
      defaultValue: '[Full Address Line 1]\n[Jaipur, Rajasthan - pincode]',
    },
    {
      name: 'paymentSettings',
      type: 'group',
      fields: [
        {
          name: 'acceptUpi',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'upiId',
          type: 'text',
          defaultValue: process.env.UPI_ID || 'payments@deeksha',
        },
        {
          name: 'acceptBankTransfer',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'bankAccountName',
          type: 'text',
          defaultValue: process.env.BANK_ACCOUNT_NAME || 'Deeksha Handicrafts',
        },
        {
          name: 'bankName',
          type: 'text',
          defaultValue: process.env.BANK_NAME || 'Your Bank Name',
        },
        {
          name: 'bankAccountNumber',
          type: 'text',
          defaultValue: process.env.BANK_ACCOUNT_NUMBER || '1234567890',
        },
        {
          name: 'bankIfsc',
          type: 'text',
          defaultValue: process.env.BANK_IFSC || 'BANK0001234',
        },
        {
          name: 'acceptCashOnDelivery',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'paymentInstructions',
          type: 'textarea',
          defaultValue:
            'Share your order reference after payment so we can confirm your build slot and delivery timeline.',
        },
      ],
    },
  ],
}
