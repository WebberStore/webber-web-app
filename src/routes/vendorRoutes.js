import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/navbar'
import Layout from '../pages/Layout'

import Stock from '../components/Vendor/Stock'

const vendorRoutes = () => {
  return (
    <div>
      <Navbar name={'Sunil Perera'} />

      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
        <Route path="/vendor/stock" element={<Stock />} />
        {/* </Route> */}
      </Routes>
    </div>
  )
}

export default vendorRoutes
