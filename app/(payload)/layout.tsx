import type { ReactNode } from 'react'

import config from '@payload-config'
import '@payloadcms/next/css'
import { RootLayout, handleServerFunctions, metadata } from '@payloadcms/next/layouts'

import './custom.scss'
import { importMap } from './admin/importMap'

type Props = {
  children: ReactNode
}

const serverFunction = async (
  args: Parameters<typeof handleServerFunctions>[0],
) => {
  'use server'

  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

export { metadata }

export default function Layout({ children }: Props) {
  return RootLayout({
    children,
    config,
    importMap,
    serverFunction,
  })
}
