import type { ReactNode } from "react"
import NavBar from './NavBar'
import FooterBar from './FooterBar'

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-8">
                {children}
            </main>
            <FooterBar />
        </div>
    )
}
