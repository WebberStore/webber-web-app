import { Routes, Route } from 'react-router-dom'
import Layout from '../pages/Layout'
import Login from '../pages/Login'

export default function LoginRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}
