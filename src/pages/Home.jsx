import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

function Home() {
  const [itens, setItens] = useState([])
  const [categorias, setCategorias] = useState([])
  const [locais, setLocais] = useState([])
  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("")
  const [categoria, setCategoria] = useState("")
  const [local, setLocal] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function buscarListas() {
      try {
        const resCategorias = await api.get("/categorias")
        const resLocais = await api.get("/locais")
        setCategorias(resCategorias.data)
        setLocais(resLocais.data)
      } catch (erro) {
        console.log(erro)
      }
    }
    buscarListas()
  }, [])

  useEffect(() => {
    async function buscarItens() {
      setCarregando(true)
      setErro("")
      try {
        const resposta = await api.get("/itens", {
          params: {
            busca: busca,
            status: status,
            categoria: categoria,
            local: local
          }
        })
        setItens(resposta.data)
      } catch (erro) {
        setErro("Não foi possível carregar. Verifique sua chave.")
      } finally {
        setCarregando(false)
      }
    }
    buscarItens()
  }, [busca, status, categoria, local])

  return (
    <div>
      <div className="topo-lista">
        <h2>Itens encontrados</h2>
        <Link to="/novo" className="botao">+ Novo item</Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por nome ou descrição..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="filtros">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Status</option>
          <option value="aguardando">aguardando</option>
          <option value="devolvido">devolvido</option>
        </select>

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Categoria</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option value="">Local</option>
          {locais.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {carregando && <p>Carregando itens...</p>}
      {erro && <p className="erro">{erro}</p>}
      {!carregando && !erro && itens.length === 0 && <p>Nenhum item encontrado.</p>}

      {itens.map((item) => (
        <Link to={"/item/" + item.id} key={item.id} className="card">
          <div>
            <h3>{item.nome}</h3>
            <p>{item.categoria} · {item.local}</p>
          </div>
          <span className={"status " + item.status}>{item.status}</span>
        </Link>
      ))}
    </div>
  )
}

export default Home