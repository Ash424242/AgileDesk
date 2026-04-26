import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProyectoProvider } from './context/ProyectoContext'
import Layout from './components/Layout'
import PaginaPrincipal from './pages/PaginaPrincipal'
import Pagina404 from './pages/Pagina404'
import './App.css'

function App() {
  return (
    <ProyectoProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<PaginaPrincipal />} />
            <Route path="*" element={<Pagina404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProyectoProvider>
  )
}

export default App
