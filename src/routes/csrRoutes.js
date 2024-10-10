import { Routes, Route } from 'react-router-dom'

import AccountsActivate from '../components/CSR/AccountsActivate'
import Order from '../components/CSR/Order'
import UserProfile from '../components/CSR/UserProfile'
import OrderCancel from '../components/CSR/OrderCancel'
import Layout from '../pages/LayoutCSR'

const csrRoutes = () => {
  return (
    <div>
      {/* <Navbar name={'Sunil Perera'} /> */}

      <Routes>
        <Route path="/csr" element={<Layout />}>
          <Route path="/csr/accountsActivate" element={<AccountsActivate />} />
          <Route path="/csr/order" element={<Order />} />
          <Route path="/csr/userProfile" element={<UserProfile />} />
          <Route path="/csr/orderCancel" element={<OrderCancel />} />
        </Route>
      </Routes>
    </div>
  )
}

export default csrRoutes
