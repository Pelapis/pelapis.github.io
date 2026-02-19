import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import FooterBar from './FooterBar'

export default function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-8">
                <Outlet />
            </main>
            <FooterBar />
        </div>
    )
}
