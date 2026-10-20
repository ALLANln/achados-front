import { Routes, Route } from "react-router-dom"
import Cabecalho from "./components/Cabecalho"
import Home from "./pages/Home"
import Detalhe from "./pages/Detalhe"
import Formulario from "./pages/Formulario"

function App() {
  return (
    <div>
      <Cabecalho />
      <div className="conteudo">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<Detalhe />} />
          <Route path="/novo" element={<Formulario />} />
          <Route path="/editar/:id" element={<Formulario />} />
        </Routes>
      </div>
    </div>
  )
}

export default App