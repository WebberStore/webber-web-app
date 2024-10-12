import { Routes, Route } from 'react-router-dom'
import Login from '../components/login/Login'

export default function LoginRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  )
}
