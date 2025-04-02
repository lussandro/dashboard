// src/pages/App.tsx
import { useState } from 'react'
import './styles/login.css'
import { supabase } from './supabaseClient'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


export default function Login() {
  const [showRegister, setShowRegister] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [cpfcnpj, setCpfcnpj] = useState('')
  const [instancia, setInstancia] = useState('')
  const [token, setToken] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginSenha, setLoginSenha] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setSucesso('')
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginSenha
    })
  
    if (error || !data.user) {
      toast.error('Email ou senha inválidos.')
    } else {
      toast.success('Login realizado com sucesso!')
      navigate('/dashboard')
    }
  }
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (!nome || !email || !senha || !cpfcnpj || !instancia || !token) {
      setErro('Preencha todos os campos.')
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome, cpfcnpj, instancia, token }
      }
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Conta criada com sucesso! Verifique seu e-mail.')
      setShowRegister(false)
      setNome('')
      setEmail('')
      setSenha('')
      setCpfcnpj('')
      setInstancia('')
      setToken('')
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-glass">
        <div className="login-left">
          <img src="/banner-img.svg" alt="Cartão" className="login-img" />
          <p className="slogan">Sua API de Integração com o Whatsapp.</p>
        </div>

        <div className="login-right">
          <h2>ChatCoreAPI.io</h2>

          {showRegister ? (
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <input
                type="text"
                placeholder="CPF ou CNPJ"
                value={cpfcnpj}
                onChange={(e) => setCpfcnpj(e.target.value)}
              />
              <input
                type="text"
                placeholder="Instância"
                value={instancia}
                onChange={(e) => setInstancia(e.target.value)}
              />
              <input
                type="text"
                placeholder="Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <button type="submit">Cadastrar</button>
              <a onClick={() => setShowRegister(false)}>Já tenho conta</a>
              {erro && <p className="erro">{erro}</p>}
              {sucesso && <p className="sucesso">{sucesso}</p>}
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                value={loginSenha}
                onChange={(e) => setLoginSenha(e.target.value)}
              />
              <button type="submit">Acessar</button>
              <a href="#">Esqueci minha senha</a>
              <div className="register-cta">
                <p>Não tem conta?</p>
                <button
                  className="register-button"
                  onClick={() => setShowRegister(true)}
                  type="button"
                >
                  Criar conta agora
                </button>
              </div>
              {erro && <p className="erro">{erro}</p>}
              {sucesso && <p className="sucesso">{sucesso}</p>}
            </form>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  )
}