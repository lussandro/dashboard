import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function MinhaConta() {
  const [dados, setDados] = useState({
    nome: '',
    cpfcnpj: '',
    telefone: '',
    email: '',
    instancia: '',
    token: ''
  })

  const [editando, setEditando] = useState(false)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    const { data } = await supabase.auth.getUser()
    if (data?.user) {
      setDados({
        nome: data.user.user_metadata.nome || '',
        cpfcnpj: data.user.user_metadata.cpfcnpj || '',
        telefone: data.user.user_metadata.telefone || '',
        email: data.user.email || '',
        instancia: data.user.user_metadata.instancia || '',
        token: data.user.user_metadata.token || ''
      })
    }
  }

  const atualizarDados = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        nome: dados.nome,
        cpfcnpj: dados.cpfcnpj,
        telefone: dados.telefone,
        instancia: dados.instancia,
        token: dados.token
      }
    })

    if (error) {
      toast.error('Erro ao atualizar!')
    } else {
      toast.success('Dados atualizados com sucesso!')
      setEditando(false)
    }
  }

  return (
    <div className="minha-conta-main">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="titulo-sistema">Minha Conta</h2>

      <div className="dados-usuario">
        {['nome', 'cpfcnpj', 'telefone', 'email', 'instancia', 'token'].map((campo) => (
          <div className="campo" key={campo}>
            <label>{campo.toUpperCase().replace('_', '/')}</label>
            <input
              type="text"
              value={dados[campo as keyof typeof dados]}
              onChange={(e) =>
                setDados({ ...dados, [campo]: e.target.value })
              }
              disabled={!editando || campo === 'email'}
            />
          </div>
        ))}

        {editando ? (
          <button className="btn-salvar" onClick={atualizarDados}>Salvar</button>
        ) : (
          <button className="btn-editar" onClick={() => setEditando(true)}>Editar</button>
        )}
      </div>
    </div>
  )
}
