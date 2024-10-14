import { HashRouter, Route, Routes } from 'react-router-dom'
import { Disparador } from './pages/Disparador'
import { Home } from './pages/Home'
import { Instancias } from './pages/Instancias'
import { GlobalStyle } from './styles/global'

export function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/disparador" element={<Disparador />} />
                <Route path="/instancias" element={<Instancias />} />
            </Routes>
        </HashRouter>
    )
}