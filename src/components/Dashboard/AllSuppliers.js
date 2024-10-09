import React, { useState, useEffect } from 'react'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'
import * as XLSX from 'xlsx'

export default function AllSuppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newSupplier, setNewSupplier] = useState({
    supplierName: '',
    address: '',
    email: '',
    contactNo: '',
  })
  const { auth } = useAuth()

  useEffect(() => {
    getSuppliers()
  }, [])

  const getSuppliers = () => {
    axios
      .get('http://localhost:4000/item/supplier')
      .then((res) => {
        setSuppliers(res.data.result)
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewSupplier((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post('http://localhost:4000/item/supplier', newSupplier)
      .then(() => {
        setIsModalOpen(false)
        getSuppliers()
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  const deleteSupplier = (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      axios
        .delete(`http://localhost:4000/item/supplier/${id}`)
        .then(() => {
          alert('Supplier deleted successfully')
          getSuppliers()
        })
        .catch((err) => {
          alert(err.message)
        })
    }
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(suppliers)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Suppliers')
    XLSX.writeFile(wb, 'Suppliers.xlsx')
  }

  const renderModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-xl w-1/3">
        <h2 className="text-2xl mb-4">Add New Supplier</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="supplierName"
            placeholder="Supplier Name"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="contactNo"
            placeholder="Contact Number"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
      <div className="flex justify-between items-center">
        <strong className="text-gray-700 font-medium">All Suppliers</strong>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add New Supplier
        </button>
        <button
          onClick={exportToExcel}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Export
        </button>
      </div>

      {isModalOpen && renderModal()}

      <div className="border-x border-gray-200 rounded-sm mt-3">
        <table className="w-full text-gray-700">
          <thead>
            <tr>
              <th>ID</th>
              <th>Supplier Name</th>
              <th>Address</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.id}</td>
                <td>{supplier.supplierName}</td>
                <td>{supplier.address}</td>
                <td>{supplier.email}</td>
                <td>{supplier.contactNo}</td>
                <td>
                  <button
                    onClick={() => deleteSupplier(supplier.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
