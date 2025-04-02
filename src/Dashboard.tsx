import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { FaCopy, FaCircle } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Dashboard() {
  const [nome, setNome] = useState('')
  const [instancia, setInstancia] = useState('')
  const [token, setToken] = useState('')
  const [status, setStatus] = useState<'online' | 'offline'>('offline')
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrCodeBase64, setQrCodeBase64] = useState('')
  const [loadingQRCode, setLoadingQRCode] = useState(false)
  const [telefone, setTelefone] = useState('')
  const [mensagem, setMensagem] = useState('')


  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (data?.user) {
        const meta = data.user.user_metadata
        setNome(meta?.nome || '')
        setInstancia(meta?.instancia || '')
        setToken(meta?.token || '')
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    if (instancia && token) {
      verificarStatus()
    }
  }, [instancia, token])

  const verificarStatus = async () => {
    try {
      const res = await fetch(`https://api.chatcoreapi.io/instance/connectionState/${instancia}`, {
        headers: {
          apikey: token
        }
      })
      const json = await res.json()
      setStatus(json.instance?.state === 'open' ? 'online' : 'offline')
    } catch (err) {
      console.error('Erro ao verificar status:', err)
      setStatus('offline')
    }
  }

  const copiar = (valor: string) => {
    navigator.clipboard.writeText(valor)
    toast.success('Copiado!')
  }

  const handleDesconectar = async () => {
    try {
      const res = await fetch(`https://api.chatcoreapi.io/instance/logout/${instancia}`, {
        method: 'DELETE',
        headers: { apikey: token }
      })
  
      const json = await res.json()
  
      if (json.status === 'SUCCESS') {
        toast.success(json.response.message || 'Desconectado com sucesso!')
  
        // 🔁 Aguarda 5 segundos e recarrega
        setTimeout(() => {
          toast.info('Atualizando status...')
          window.location.reload()
        }, 5000)
      } else {
        toast.error('Erro ao desconectar a instância.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Erro na requisição de desconexão.')
    }
  }
  

  const handleConectar = async () => {
    setLoadingQRCode(true)
    setShowQRCode(true)
  
    try {
      const res = await fetch(`https://api.chatcoreapi.io/instance/connect/${instancia}`, {
        headers: { apikey: token }
      })
  
      const json = await res.json()
      
          if (json?.base64) {
            setQrCodeBase64(json.base64)
            toast.success('QR Code gerado com sucesso!')
      
            // 🎉 Espera 30 segundos e dá refresh
            setTimeout(() => {
              toast.info('Atualizando status da instância...')
              window.location.reload()
            }, 30000)
          } else {
            toast.error('Não foi possível obter o QR Code.')
          }
        } catch (err) {
          console.error(err)
          toast.error('Erro ao conectar com a instância.')
        }
      
        setLoadingQRCode(false)
      }
      const handleEnviarMensagem = async () => {
        if (!telefone || !mensagem) {
          toast.warn('Preencha o telefone e a mensagem.')
          return
        }
      
        try {
          const res = await fetch(`https://api.chatcoreapi.io/message/sendText/${instancia}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: token
            },
            body: JSON.stringify({
              number: telefone,
              options: {
                delay: 1200,
                presence: 'composing',
                linkPreview: false
              },
              textMessage: {
                text: mensagem
              }
            })
          })
      
          const json = await res.json()
      
          if (json?.status === 'PENDING') {
            toast.success('Mensagem enviada com sucesso!')
            setTelefone('')
            setMensagem('')
          } else {
            toast.error('Erro ao enviar mensagem.')
          }
        } catch (err) {
          console.error(err)
          toast.error('Falha na requisição.')
        }
      }
      
  return (
    <div className="dashboard-main">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="titulo-sistema">Olá, {nome}</h2>
      <h3 className="subtitulo">Painel da Instância</h3>

      <div className="instancia-box">
        <p>
          <strong>Instância:</strong> {instancia}
          <FaCopy className="icone" onClick={() => copiar(instancia)} />
        </p>
        <p>
          <strong>Token:</strong> {token}
          <FaCopy className="icone" onClick={() => copiar(token)} />
        </p>
        <p>
          <strong>Status:</strong>
          <FaCircle className={`status-icon ${status}`} /> {status === 'online' ? 'Online' : 'Offline'}
        </p>

        <button
          className={`botao-instancia ${status}`}
          onClick={status === 'online' ? handleDesconectar : handleConectar}
        >
          {status === 'online' ? 'Desconectar' : 'Conectar'}
        </button>
       {showQRCode && (
          <div className="qrcode-modal">
            {loadingQRCode ? (
              <p>Carregando QR Code...</p>
            ) : (
              <>
                <img src={qrCodeBase64} alt="QR Code" className="qrcode-img" />
                <div className="qr-buttons">
                  <button onClick={handleConectar}>🔄 Atualizar</button>
                  <button onClick={() => setShowQRCode(false)}>❌ Cancelar</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className="teste-envio">
        <h4>Teste de Envio</h4>
        <input
          type="text"
          placeholder="Telefone com DDD (ex: 5599999999999)"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <textarea
          placeholder="Mensagem de teste"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        />
        <button onClick={handleEnviarMensagem}>Enviar</button>
      </div>
    </div>
  )
}

