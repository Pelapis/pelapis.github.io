import { Link, useLocation } from 'react-router'
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => closeMenu(), [location.pathname])

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          我的博客
        </Link>

        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="切换菜单"
        >
          <span className="hamburger"></span>
        </button>

        <nav className={`navbar-nav ${isMenuOpen ? 'is-open' : ''}`}>
          <Link to="/" onClick={closeMenu}>首页</Link>
          <Link to="/projects" onClick={closeMenu}>项目</Link>
          <Link to="/about" onClick={closeMenu}>关于</Link>
        </nav>
      </div>

      <style>{`
        .navbar {
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-brand {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          text-decoration: none;
        }

        .navbar-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .hamburger {
          display: block;
          width: 24px;
          height: 2px;
          background-color: #333;
          position: relative;
        }

        .hamburger::before,
        .hamburger::after {
          content: '';
          position: absolute;
          width: 24px;
          height: 2px;
          background-color: #333;
          left: 0;
        }

        .hamburger::before {
          top: -8px;
        }

        .hamburger::after {
          top: 8px;
        }

        .navbar-nav {
          display: flex;
          gap: 2rem;
        }

        .navbar-nav a {
          color: #666;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .navbar-nav a:hover,
        .navbar-nav a.active {
          color: #42b883;
        }

        @media (max-width: 768px) {
          .navbar-toggle {
            display: block;
          }

          .navbar-nav {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: #fff;
            flex-direction: column;
            padding: 1rem;
            gap: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: none;
          }

          .navbar-nav.is-open {
            display: flex;
          }
        }
      `}</style>
    </header>
  )
}
