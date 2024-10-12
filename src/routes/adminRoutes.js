import { Routes, Route } from 'react-router-dom'
import Layout from '../pages/Layout'

import Users from '../components/Admin/Users'
import Stock from '../components/Admin/Stock'
import Order from '../components/Admin/Order'
import Categories from '../components/Admin/Categories'
import OrderCancel from '../components/Admin/OrderCancel'
import Customers from '../components/Admin/Customers'
import Dashboard from '../components/Admin/Dashboard'

export default function adminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="stock" element={<Stock />} />
        <Route path="users" element={<Users />} />
        <Route path="order" element={<Order />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orderCancel" element={<OrderCancel />} />
        <Route path="customers" element={<Customers />} />
      </Route>
    </Routes>
  )
}
