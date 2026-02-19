import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false)
    }, [])

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev)
    }, [])

    useEffect(() => {
        const checkMobile = () => {
            const isMobile = window.innerWidth < 768
            if (!isMobile) {
                setIsMenuOpen(false)
            }
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => {
            window.removeEventListener('resize', checkMobile)
        }
    }, [])

    useEffect(() => closeMenu(), [location.pathname, closeMenu])

    return (
        <header className="bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] sticky top-0 z-50">
            <div className="max-w-[1200px] mx-auto px-4 py-4 flex justify-between items-center">
                <Link
                    to="/"
                    className="text-2xl font-bold text-gray-800 no-underline hover:text-gray-800"
                    onClick={closeMenu}
                >
                    我的博客
                </Link>

                <button
                    className="md:hidden bg-transparent border-none cursor-pointer p-2"
                    onClick={toggleMenu}
                    aria-expanded={isMenuOpen}
                    aria-label="切换菜单"
                >
                    <span className="block w-6 h-0.5 bg-gray-800 relative">
                        <span className="absolute w-6 h-0.5 bg-gray-800 left-0 -top-2"></span>
                        <span className="absolute w-6 h-0.5 bg-gray-800 left-0 top-2"></span>
                    </span>
                </button>

                <nav className={`flex gap-8 ${isMenuOpen ? 'absolute top-full left-0 right-0 bg-white flex-col p-4 gap-4 shadow-[0_4px_6px_rgba(0,0,0,0.1)]' : 'hidden md:flex'}`}>
                    <Link
                        to="/"
                        className="text-gray-600 no-underline font-medium transition-colors hover:text-primary"
                        onClick={closeMenu}
                    >
                        首页
                    </Link>
                    <Link
                        to="/about"
                        className="text-gray-600 no-underline font-medium transition-colors hover:text-primary"
                        onClick={closeMenu}
                    >
                        关于
                    </Link>
                </nav>
            </div>
        </header>
    )
}
