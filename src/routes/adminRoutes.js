import { Routes, Route } from 'react-router-dom'
import Layout from '../pages/Layout'

import AddNewUser from '../components/Dashboard/AddNewUser'
import RequireAuth from '../components/login/RequireAuth'

import Users from '../components/Dashboard/Users'

import Stock from '../components/Admin/Stock'

export default function adminRoutes() {
  return (
    <Routes>
      {/* <Route element={<RequireAuth allowedRole={'admin'} />}> */}
      <Route path="/admin" element={<Layout />}>
        {/* <Route index element={<Dashboard />} /> */}
        <Route path="stock" element={<Stock />} />
      </Route>
      {/* </Route> */}
    </Routes>
  )
}
