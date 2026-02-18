import { Link } from 'react-router-dom'

export function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">
        投资模拟
      </Link>
      <Link to="/snake" className="nav-link">
        贪吃蛇
      </Link>
    </nav>
  )
}
