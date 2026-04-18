import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Marketplace from './pages/Marketplace'
import ProductDetail from './pages/ProductDetail'
import Dashboard from './pages/Dashboard'
import CreateFamiliar from './pages/CreateFamiliar'
import Earnings from './pages/Earnings'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateFamiliar />} />
        <Route path="/earnings" element={<Earnings />} />
      </Route>
    </Routes>
  )
}
