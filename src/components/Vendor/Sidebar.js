import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DASHBOARD_SIDEBAR_LINKS } from './navigation'
const Sidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // handle logout--------------------------------------------------
  const handleLogout = () => {
    // remove user id from localStorage-----------------------------------------
    localStorage.removeItem('csrid')

    // redirect to login page----------------------------------------------------
    navigate('/')
  }

  return (
    <div
      className="bg-dark p-3 d-flex flex-column text-white position-fixed h-100"
      style={{ width: '240px' }}
    >
      <div className="d-flex align-items-center gap-2 px-1 py-3">
        <i className="bi bi-globe fs-4 text-primary"></i>
        <span className="fs-5 text-white">Webber -</span> Vendor
      </div>

      {/* ---------------------------------------links----------------------------------------- */}
      <div className="flex-grow-1 py-2 d-flex flex-column gap-1">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} pathname={pathname} />
        ))}
      </div>

      {/* --------------------------------------------------logout------------------------------------------------ */}
      <div className="d-flex flex-column gap-1 pt-2 border-top border-secondary">
        <Link
          to="/"
          onClick={handleLogout}
          className="text-danger text-decoration-none d-flex align-items-center gap-2 px-3 py-2"
        >
          <i className="bi bi-box-arrow-right"></i>
          Log Out
        </Link>
      </div>
    </div>
  )
}

function SidebarLink({ item, pathname }) {
  return (
    <Link
      to={item.path}
      className={`d-flex align-items-center gap-2 px-3 py-2 text-decoration-none rounded ${
        pathname === item.path ? 'bg-secondary text-white' : 'text-white'
      }`}
    >
      <i className={`bi ${item.icon}`}></i>
      {item.label}
    </Link>
  )
}

export default Sidebar
