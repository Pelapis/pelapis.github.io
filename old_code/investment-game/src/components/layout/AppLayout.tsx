import type { ReactNode } from 'react'
import { NavBar } from './NavBar'
import { FooterBar } from './FooterBar'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <NavBar />
      <main className="main-content">{children}</main>
      <FooterBar />
    </div>
  )
}
