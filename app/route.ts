import { getFrontendHTML } from '../src/lib/frontend-template'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const html = await getFrontendHTML()

  return new Response(html, {
    headers: {
      'cache-control': 'no-store',
      'content-type': 'text/html; charset=utf-8',
    },
  })
}
