import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Vendor/Sidebar' // Import the Sidebar

const LayoutVendor = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: '240px' }}>
        <Outlet /> {/* This is where child routes will be rendered */}
      </div>
    </div>
  )
}

export default LayoutVendor
