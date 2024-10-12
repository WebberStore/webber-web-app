import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import AdminRoutes from './adminRoutes'
import CSRRoutes from './csrRoutes'
import VendorRoutes from './vendorRoutes'
import LoginRoutes from './loginRoutes'

const IndexRoutes = () => {
  return (
    <div>
      <AdminRoutes />
      <VendorRoutes />
      <CSRRoutes />
      <LoginRoutes />
    </div>
  )
}

export default IndexRoutes
