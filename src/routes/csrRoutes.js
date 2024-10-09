import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/navbar'
import AccountsActivate from '../components/CSR/AccountsActivate'
import Layout from '../pages/Layout'

const csrRoutes = () => {
  return (
    <div>
      <Navbar name={'Sunil Perera'} />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/accountsActivate" element={<AccountsActivate />} />
        </Route>
      </Routes>
    </div>
  )
}

export default csrRoutes
