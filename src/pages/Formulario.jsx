import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"

function Formulario() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [categoria, setCategoria] = useState("")
  const [local, setLocal] = useState("")
  const [dataEncontrado, setDataEncontrado] = useState("")
  const [categorias, setCategorias] = useState([])
  const [locais, setLocais] = useState([])
  const [mensagem, setMensagem] = useState("")
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function buscarListas() {
      try {
        const resCategorias = await api.get("/categorias")
        const resLocais = await api.get("/locais")
        setCategorias(resCategorias.data)
        setLocais(resLocais.data)
      } catch (erro) {
        setErro("Não foi possível carregar categorias e locais.")
      }
    }
    buscarListas()
  }, [])

  useEffect(() => {
    async function buscarItem() {
      try {
        const resposta = await api.get("/itens/" + id)
        setNome(resposta.data.nome)
        setDescricao(resposta.data.descricao)
        setCategoria(resposta.data.categoria)
        setLocal(resposta.data.local)
        setDataEncontrado(resposta.data.data_encontrado)
      } catch (erro) {
        setErro("Não foi possível carregar o item.")
      }
    }
    if (id) {
      buscarItem()
    }
  }, [id])

  async function salvar(e) {
    e.preventDefault()
    setErro("")
    setMensagem("")

    const dados = {
      nome: nome,
      descricao: descricao,
      categoria: categoria,
      local: local,
      data_encontrado: dataEncontrado
    }

    try {
      if (id) {
        await api.put("/itens/" + id, dados)
        setMensagem("Item atualizado com sucesso!")
      } else {
        await api.post("/itens", dados)
        setMensagem("Item cadastrado com sucesso!")
      }
      setTimeout(() => navigate("/"), 1000)
    } catch (erro) {
      if (erro.response && erro.response.status === 422) {
        setErro("Dados inválidos: " + JSON.stringify(erro.response.data.detail))
      } else {
        setErro("Erro ao salvar o item.")
      }
    }
  }

  return (
    <form onSubmit={salvar} className="formulario">
      <h2>{id ? "Editar item" : "Novo item"}</h2>

      <label>Nome</label>
      <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

      <label>Descrição</label>
      <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />

      <label>Categoria</label>
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
        <option value="">Selecione</option>
        {categorias.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label>Local</label>
      <select value={local} onChange={(e) => setLocal(e.target.value)}>
        <option value="">Selecione</option>
        {locais.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <label>Data em que foi encontrado</label>
      <input type="date" value={dataEncontrado} onChange={(e) => setDataEncontrado(e.target.value)} />

      {erro && <p className="erro">{erro}</p>}
      {mensagem && <p className="sucesso">{mensagem}</p>}

      <div className="botoes">
        <button type="submit" className="botao">Salvar</button>
        <button type="button" className="botao cinza" onClick={() => navigate("/")}>Cancelar</button>
      </div>
    </form>
  )
}

export default Formulario