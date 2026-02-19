import type { ReactNode } from 'react'
import { NavBar } from './NavBar'
import { FooterBar } from './FooterBar'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1">{children}</main>
      <FooterBar />
    </div>
  )
}
