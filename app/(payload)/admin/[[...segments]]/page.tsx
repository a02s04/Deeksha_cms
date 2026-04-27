import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'

import { importMap } from '../importMap'

type PageProps = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const generateMetadata = async ({
  params,
  searchParams,
}: PageProps): Promise<Metadata> =>
  generatePageMetadata({
    config,
    params,
    searchParams: searchParams as Promise<Record<string, string | string[]>>,
  })

export default function Page({ params, searchParams }: PageProps) {
  return RootPage({
    config,
    importMap,
    params,
    searchParams: searchParams as Promise<Record<string, string | string[]>>,
  })
}
