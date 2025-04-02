import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import DashboardLayout from './DashboardLayout'
import Dashboard from './Dashboard'
import Financeiro from './Financeiro'
import './index.css'
import MinhaConta from './MinhaConta'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/minhaconta" element={<MinhaConta />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
