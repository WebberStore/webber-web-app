import React, { useState, useEffect } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Customers() {
  const [customers, setCustomers] = useState([])

  const API_URL = process.env.REACT_APP_API_URL

  // retriew all cutomer details----------------------------------------------------------------
  useEffect(() => {
    getCustomers()
  }, [])

  const getCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/role/Customer`)
      setCustomers(response.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Customers</h3>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Approve Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer.id}>
              <td>{index + 1}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.role}</td>
              <td>{customer.approveStatus ? 'Approved' : 'Not Approved'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
