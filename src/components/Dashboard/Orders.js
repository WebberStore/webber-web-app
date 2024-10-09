import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // Use effect hook to fetch orders
    fetchOrders()
  }, [])

  const fetchOrders = () => {
    // Function to fetch orders from the server
    axios
      .get('http://localhost:4000/order/requisition')
      .then((res) => {
        const updatedOrders = res.data.result.map((order) => ({
          ...order,
          // Automatically accept orders with amount < 10000
          status: order.amount < 100000 ? 'ACCEPTED' : order.status,
        }))
        setOrders(updatedOrders)
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  // Function to update the status of an order
  const updateOrderStatus = (orderId, newStatus) => {
    axios
      .patch('http://localhost:4000/order/requisition', {
        id: orderId,
        status: newStatus,
      })
      .then(() => {
        setOrders(
          // Update state with the new order status
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        )
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  return (
    <section className="mt-10">
      <h2 className="font-medium text-lg mb-4">Order Requests</h2>
      <table className="w-full bg-white rounded-lg overflow-hidden">
        <thead>
          <tr className="text-left bg-gray-200">
            <th className="p-4">ID</th>
            <th>DETAILS</th>
            <th>ORDER DATE & TIME</th>
            <th>reqOrdNo</th>
            <th>Amount</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.details}</td>
              <td>{order.createdDate}</td>
              <td>{order.reqOrdNo}</td>
              <td>{order.amount}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'ACCEPTED'
                      ? 'bg-green-500 text-white'
                      : order.status === 'REJECTED'
                      ? 'bg-red-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="flex space-x-4">
                <button
                  className="text-green-500 px-2 py-1 rounded-full "
                  onClick={() => updateOrderStatus(order.id, 'ACCEPTED')}
                  disabled={order.status === 'ACCEPTED' || order.amount < 10000}
                >
                  Accept
                </button>
                <button
                  className="text-red-500 px-2 py-1 rounded-full"
                  onClick={() => updateOrderStatus(order.id, 'REJECTED')}
                  disabled={order.status === 'ACCEPTED' || order.amount < 10000}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
