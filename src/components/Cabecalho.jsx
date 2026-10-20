import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

function Cabecalho() {
  const [nome, setNome] = useState("")

  useEffect(() => {
    async function buscarDono() {
      try {
        const resposta = await api.get("/eu")
        setNome(resposta.data.nome)
      } catch (erro) {
        setNome("")
      }
    }
    buscarDono()
  }, [])

  return (
    <header className="cabecalho">
      <Link to="/" className="logo">Achados IFRN</Link>
      <span>Olá, {nome}</span>
    </header>
  )
}

export default Cabecalho