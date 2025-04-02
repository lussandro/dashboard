// src/DashboardLayout.tsx
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import './styles/dashboard.css'

export default function DashboardLayout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        {/* <h2 className="logo">Menu</h2> */}
        <nav>
          <ul className="nav-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/financeiro">Financeiro</Link></li>
            <li><Link to="/minhaconta">Minha Conta</Link></li>
          </ul>
        </nav>
        <button onClick={handleLogout} className="logout-button" aria-label="Sair da conta">
          Sair
        </button>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}
