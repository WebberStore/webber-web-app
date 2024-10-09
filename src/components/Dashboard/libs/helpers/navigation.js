import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineAnnotation,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog,
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: <HiOutlineViewGrid />,
  },
  {
    key: 'dashboard',
    label: 'Orders',
    path: '/allSites',
    icon: <HiOutlineDocumentText />,
  },
  {
    key: 'dashboard',
    label: 'Products',
    path: '/siteManagers',
    icon: <HiOutlineViewGrid />,
  },
  {
    key: 'products',
    label: 'Accounts',
    path: '/AllProducts',
    icon: <HiOutlineUsers />,
  },
  {
    key: 'orders',
    label: 'Profile',
    path: '/orders',
    icon: <HiOutlineAnnotation />,
  },
  // {
  //   key: 'customers',
  //   label: 'Suppliers',
  //   path: '/suppliers',
  //   icon: <HiOutlineUsers />,
  // },
  // {
  //   key: 'transactions',
  //   label: 'Users',
  //   path: '/users',
  //   icon: <HiOutlineDocumentText />,
  // },
  // {
  //   key: 'messages',
  //   label: 'Messages',
  //   path: '/messages',
  //   icon: <HiOutlineAnnotation />,
  // },
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  // {
  //   key: 'settings',
  //   label: 'Settings',
  //   path: '/settings',
  //   icon: <HiOutlineCog />,
  // },
  // {
  //   key: 'support',
  //   label: 'Help & Support',
  //   path: '/support',
  //   icon: <HiOutlineQuestionMarkCircle />,
  // },
]
