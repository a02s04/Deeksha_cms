import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { getPayloadClient } from './payload'
import { resolveSiteSettings } from './site-settings'

const templatePath = path.resolve(process.cwd(), 'index.html')

const escapeHTML = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const safeJSONStringify = (value: unknown) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')

const replaceAll = (template: string, token: string, value: string) =>
  template.split(token).join(value)

export const getFrontendHTML = async () => {
  const payload = await getPayloadClient()
  const siteSettings = await resolveSiteSettings(payload)
  const serverURL =
    payload.config.serverURL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const canonicalURL = new URL('/', serverURL).toString()
  const ogImageURL = new URL('/images/hero-room-after.jpg', serverURL).toString()
  const workshopAddressHTML = escapeHTML(siteSettings.workshopAddress).replace(/\r?\n/g, '<br>')

  let html = await readFile(templatePath, 'utf-8')

  html = replaceAll(html, '__CANONICAL_URL__', canonicalURL)
  html = replaceAll(html, '__CONTACT_EMAIL__', escapeHTML(siteSettings.contactEmail))
  html = replaceAll(html, '__DISPLAY_PHONE__', escapeHTML(siteSettings.displayPhone))
  html = replaceAll(html, '__INSTAGRAM_HANDLE__', escapeHTML(siteSettings.instagramHandle))
  html = replaceAll(html, '__INSTAGRAM_URL__', escapeHTML(siteSettings.instagramUrl))
  html = replaceAll(html, '__OG_IMAGE__', ogImageURL)
  html = replaceAll(html, '__WHATSAPP_NUMBER__', escapeHTML(siteSettings.whatsappNumber))
  html = replaceAll(html, '__WORKSHOP_ADDRESS_HTML__', workshopAddressHTML)

  const siteConfigScript = `<script>window.__SITE_CONFIG__ = ${safeJSONStringify(
    siteSettings,
  )};</script>`

  return html.replace('</head>', `  ${siteConfigScript}\n</head>`)
}
