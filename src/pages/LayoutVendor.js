import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Vendor/Sidebar'

const LayoutVendor = () => {
  return (
    <div className="d-flex">
      {/* --------------------------------------sidebar------------------------------------------------------ */}
      <Sidebar />

      {/* -----------------------------------------main content--------------------------------------------------------- */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: '240px' }}>
        <Outlet />
      </div>
    </div>
  )
}

export default LayoutVendor
