import type { Payload } from 'payload'

import type { PaymentMethod } from '../constants/catalog.ts'

export type ResolvedPaymentSettings = {
  acceptBankTransfer: boolean
  acceptCashOnDelivery: boolean
  acceptUpi: boolean
  bankAccountName: string
  bankAccountNumber: string
  bankIfsc: string
  bankName: string
  paymentInstructions: string
  upiId: string
}

export type ResolvedSiteSettings = {
  contactEmail: string
  displayPhone: string
  homePage?: unknown
  instagramHandle: string
  instagramUrl: string
  paymentSettings: ResolvedPaymentSettings
  testimonialSection?: unknown
  themeSettings?: unknown
  whatsappNumber: string
  workshopAddress: string
}

const defaultSettings: ResolvedSiteSettings = {
  contactEmail: process.env.CONTACT_EMAIL || 'hello@mdlhandicrafts.in',
  displayPhone: process.env.DISPLAY_PHONE || '+91 98765 43210',
  homePage: undefined,
  instagramHandle: process.env.INSTAGRAM_HANDLE || '@mdl_handicrafts',
  instagramUrl: process.env.INSTAGRAM_URL || 'https://instagram.com/mdl_handicrafts',
  paymentSettings: {
    acceptBankTransfer: true,
    acceptCashOnDelivery: true,
    acceptUpi: true,
    bankAccountName: process.env.BANK_ACCOUNT_NAME || 'Deeksha Handicrafts',
    bankAccountNumber: process.env.BANK_ACCOUNT_NUMBER || '1234567890',
    bankIfsc: process.env.BANK_IFSC || 'BANK0001234',
    bankName: process.env.BANK_NAME || 'Your Bank Name',
    paymentInstructions:
      'Share your order reference after payment so we can confirm your build slot and delivery timeline.',
    upiId: process.env.UPI_ID || 'payments@deeksha',
  },
  testimonialSection: undefined,
  themeSettings: {
    colorTheme: 'heritage',
    fontPairing: 'classic',
  },
  whatsappNumber: process.env.WHATSAPP_NUMBER || '919876543210',
  workshopAddress: '[Full Address Line 1]\n[Jaipur, Rajasthan - pincode]',
}

export const normalizePhoneNumber = (value: string) => value.replace(/\D/g, '')

const hasUsablePhoneNumber = (value: string) => normalizePhoneNumber(value).length >= 10

const resolvePhoneSetting = (value: string | null | undefined, fallback: string) =>
  hasUsablePhoneNumber(value || '') ? value || fallback : fallback

export const getEnabledPaymentMethods = (
  settings: ResolvedSiteSettings,
): PaymentMethod[] => {
  const methods: PaymentMethod[] = []

  if (settings.paymentSettings.acceptUpi) {
    methods.push('upi')
  }

  if (settings.paymentSettings.acceptBankTransfer) {
    methods.push('bank-transfer')
  }

  if (settings.paymentSettings.acceptCashOnDelivery) {
    methods.push('cash-on-delivery')
  }

  return methods
}

export const resolveSiteSettings = async (payload: Payload): Promise<ResolvedSiteSettings> => {
  try {
    const settings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
      overrideAccess: true,
    })

    const whatsappNumber = normalizePhoneNumber(
      resolvePhoneSetting(settings.whatsappNumber, defaultSettings.whatsappNumber),
    )
    const displayPhone = resolvePhoneSetting(settings.displayPhone, defaultSettings.displayPhone)

    return {
      contactEmail: settings.contactEmail || defaultSettings.contactEmail,
      displayPhone,
      homePage: settings.homePage || defaultSettings.homePage,
      instagramHandle: settings.instagramHandle || defaultSettings.instagramHandle,
      instagramUrl: settings.instagramUrl || defaultSettings.instagramUrl,
      paymentSettings: {
        acceptBankTransfer:
          settings.paymentSettings?.acceptBankTransfer ??
          defaultSettings.paymentSettings.acceptBankTransfer,
        acceptCashOnDelivery:
          settings.paymentSettings?.acceptCashOnDelivery ??
          defaultSettings.paymentSettings.acceptCashOnDelivery,
        acceptUpi:
          settings.paymentSettings?.acceptUpi ??
          defaultSettings.paymentSettings.acceptUpi,
        bankAccountName:
          settings.paymentSettings?.bankAccountName ||
          defaultSettings.paymentSettings.bankAccountName,
        bankAccountNumber:
          settings.paymentSettings?.bankAccountNumber ||
          defaultSettings.paymentSettings.bankAccountNumber,
        bankIfsc:
          settings.paymentSettings?.bankIfsc ||
          defaultSettings.paymentSettings.bankIfsc,
        bankName:
          settings.paymentSettings?.bankName ||
          defaultSettings.paymentSettings.bankName,
        paymentInstructions:
          settings.paymentSettings?.paymentInstructions ||
          defaultSettings.paymentSettings.paymentInstructions,
        upiId:
          settings.paymentSettings?.upiId ||
          defaultSettings.paymentSettings.upiId,
      },
      testimonialSection: settings.testimonialSection || defaultSettings.testimonialSection,
      themeSettings: settings.themeSettings || defaultSettings.themeSettings,
      whatsappNumber,
      workshopAddress: settings.workshopAddress || defaultSettings.workshopAddress,
    }
  } catch {
    return {
      ...defaultSettings,
      whatsappNumber: normalizePhoneNumber(defaultSettings.whatsappNumber),
    }
  }
}
