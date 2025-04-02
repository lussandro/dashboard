import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Cobranca {
  id: string
  value: number
  billingType: string
  status: string
  dueDate: string
  bankSlipUrl: string
}

export default function Financeiro() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregarCobrancas()
  }, [])

  const carregarCobrancas = async () => {
    setLoading(true)

    const { data } = await supabase.auth.getUser()
    const meta = data?.user?.user_metadata
    const documento = meta?.cpf_cnpj

    try {
      const res = await fetch(`https://webhook.chatcoreapi.io/webhook/5a6a196b-e2a5-41dc-a7f8-e0195ecbc1a8?cnpj_cpf=${documento}`)

      const json = await res.json()

      setCobrancas(json || [])
      toast.success('Cobranças carregadas com sucesso!')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao buscar cobranças.')
    }

    setLoading(false)
  }

  return (
    <div className="financeiro-main">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="titulo-sistema">Financeiro</h2>

      {loading ? (
        <p>Carregando cobranças...</p>
      ) : (
        <table className="tabela-financeiro">
          <thead>
            <tr>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Boleto</th>
            </tr>
          </thead>
          <tbody>
            {cobrancas.map(cob => (
              <tr key={cob.id}>
                <td>R$ {cob.value.toFixed(2)}</td>
                <td>{cob.billingType}</td>
                <td>{new Date(cob.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                <td>{cob.status}</td>
                <td>
                  <a
                    href={cob.bankSlipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="boleto-link"
                  >
                    Ver boleto
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}