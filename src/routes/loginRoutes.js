import { Routes, Route } from 'react-router-dom'
import Layout from '../pages/Layout'
import Login from '../components/login/Login'

export default function LoginRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}
