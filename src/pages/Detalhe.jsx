import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import api from "../services/api"

function Detalhe() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [mostrarDevolver, setMostrarDevolver] = useState(false)
  const [devolvidoPara, setDevolvidoPara] = useState("")
  const [mostrarExcluir, setMostrarExcluir] = useState(false)

  async function buscarItem() {
    try {
      const resposta = await api.get("/itens/" + id)
      setItem(resposta.data)
    } catch (erro) {
      if (erro.response && erro.response.status === 404) {
        setErro("Item não encontrado.")
      } else {
        setErro("Não foi possível carregar. Verifique sua chave.")
      }
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarItem()
  }, [id])

  async function devolver() {
    try {
      await api.patch("/itens/" + id + "/devolver", {
        devolvido_para: devolvidoPara
      })
      setMostrarDevolver(false)
      setDevolvidoPara("")
      buscarItem()
    } catch (erro) {
      if (erro.response && erro.response.data && erro.response.data.detail) {
        setErro(JSON.stringify(erro.response.data.detail))
      } else {
        setErro("Erro ao marcar como devolvido.")
      }
    }
  }

  async function excluir() {
    try {
      await api.delete("/itens/" + id)
      navigate("/")
    } catch (erro) {
      setErro("Erro ao excluir o item.")
      setMostrarExcluir(false)
    }
  }

  if (carregando) return <p>Carregando...</p>
  if (erro && !item) return <p className="erro">{erro}</p>

  return (
    <div className="detalhe">
      <Link to="/">← Voltar</Link>

      <h2>{item.nome}</h2>
      <span className={"status " + item.status}>{item.status}</span>

      <p><strong>Descrição:</strong> {item.descricao}</p>
      <p><strong>Categoria:</strong> {item.categoria}</p>
      <p><strong>Local:</strong> {item.local}</p>
      <p><strong>Encontrado em:</strong> {item.data_encontrado}</p>
      {item.status === "devolvido" && (
        <div>
          <p><strong>Devolvido para:</strong> {item.devolvido_para}</p>
          <p><strong>Data da devolução:</strong> {item.data_devolucao}</p>
        </div>
      )}

      {erro && <p className="erro">{erro}</p>}

      <div className="botoes">
        <Link to={"/editar/" + id} className="botao">Editar</Link>
        <button className="botao vermelho" onClick={() => setMostrarExcluir(true)}>Excluir</button>
      </div>

      {item.status === "aguardando" && (
        <div className="caixa">
          {!mostrarDevolver && (
            <button className="botao" onClick={() => setMostrarDevolver(true)}>
              Marcar como devolvido
            </button>
          )}
          {mostrarDevolver && (
            <div>
              <input
                type="text"
                placeholder="Nome de quem recebeu"
                value={devolvidoPara}
                onChange={(e) => setDevolvidoPara(e.target.value)}
              />
              <button className="botao" onClick={devolver}>Confirmar</button>
            </div>
          )}
        </div>
      )}

      {mostrarExcluir && (
        <div className="caixa">
          <p>Tem certeza que deseja excluir?</p>
          <button className="botao vermelho" onClick={excluir}>Excluir</button>
          <button className="botao cinza" onClick={() => setMostrarExcluir(false)}>Cancelar</button>
        </div>
      )}
    </div>
  )
}

export default Detalhe