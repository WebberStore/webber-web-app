import { Routes, Route } from 'react-router-dom'
import Layout from '../pages/Layout'

import AddNewUser from '../components/Dashboard/AddNewUser'
import RequireAuth from '../components/login/RequireAuth'

import Users from '../components/Admin/Users'

import Stock from '../components/Admin/Stock'
import UserProfile from '../components/Admin/UserProfile'

export default function adminRoutes() {
  return (
    <Routes>
      {/* <Route element={<RequireAuth allowedRole={'admin'} />}> */}
      {/* <Route path="/admin" element={<Layout />}> */}
      {/* <Route index element={<Dashboard />} /> */}
      <Route path="stock" element={<Stock />} />
      <Route path="userProfile" element={<UserProfile />} />
      <Route path="users" element={<Users />} />
      {/* </Route> */}
      {/* </Route> */}
    </Routes>
  )
}
