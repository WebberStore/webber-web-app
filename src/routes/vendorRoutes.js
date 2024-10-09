import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/navbar'
import Stock from '../components/Vendor/Stock'
import Orders from '../components/Vendor/Orders'
import OrderDetails from '../components/Vendor/OrderDetails'
import Layout from '../pages/Layout'

const vendorRoutes = () => {
  return (
    <div>
      {/* <Navbar name={'Sunil Perera'} /> */}

      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
        <Route path="/vendor/stock" element={<Stock />} />
        <Route path="/vendor/orders" element={<Orders />} />
        <Route path="/vendor/orderDetails" element={<OrderDetails />} />
        {/* </Route> */}
      </Routes>
    </div>
  )
}

export default vendorRoutes
