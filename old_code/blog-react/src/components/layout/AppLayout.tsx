import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import FooterBar from './FooterBar'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <NavBar />
      <main className="app-main">
        <Outlet />
      </main>
      <FooterBar />

      <style>{`
        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .app-main {
          flex: 1;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
      `}</style>
    </div>
  )
}
