import React from 'react'
import { FaLeaf } from 'react-icons/fa'
import {
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
  DASHBOARD_SIDEBAR_LINKS,
} from './navigation'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineLogout } from 'react-icons/hi'

const linkClass =
  'd-flex align-items-center gap-2 fw-light px-3 py-2 text-decoration-none rounded text-white'

export default function Sidebar() {
  return (
    <div
      className="bg-dark p-3 d-flex flex-column text-white position-fixed h-100"
      style={{ width: '240px' }}
    >
      <div className="d-flex align-items-center gap-2 px-1 py-3">
        <FaLeaf fontSize={24} color="#016a00" />
        <span className="text-white fs-5">OrbitArcX</span>
      </div>
      <div className="flex-grow-1 py-2 d-flex flex-column gap-1">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}
      </div>
      <div className="d-flex flex-column gap-1 pt-2 border-top border-secondary">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}
        <div className={classNames('text-danger cursor-pointer', linkClass)}>
          <span className="fs-4">
            <HiOutlineLogout />
          </span>
          Log Out
        </div>
      </div>
    </div>
  )
}

function SidebarLink({ item }) {
  const { pathname } = useLocation()

  return (
    <Link
      to={item.path}
      className={classNames(
        pathname === item.path ? 'bg-secondary text-white' : 'text-white', // Ensuring all text is white by default
        linkClass
      )}
    >
      <span className="fs-4">{item.icon}</span>
      {item.label}
    </Link>
  )
}
