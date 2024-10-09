import React, { useState, useEffect } from 'react'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'
import * as XLSX from 'xlsx'
import { useNavigate } from 'react-router-dom'

export default function Users() {
  const [users, setUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    userName: '',
    email: '',
    contactNo: '',
    employeeCode: '',
    role: '',
    password: '',
    department: { id: 5 },
    company: { id: 3 },
  })
  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = () => {
    axios
      .get('http://localhost:4000/employee/line-manager')
      .then((res) => {
        setUsers(res.data.result)
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'departmentId' || name === 'companyId') {
      setNewUser((prev) => ({ ...prev, [name]: { id: value } }))
    } else {
      setNewUser((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:4000/employee/line-manager', newUser)
      setIsModalOpen(false)
      getUsers() // Assuming this will fetch the updated list of users
    } catch (err) {
      alert(err.message)
    }
  }

  const deleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios
        .delete(`http://localhost:4000/item/supplier/${id}`) // Adjust the endpoint as needed
        .then(() => {
          alert('User deleted successfully')
          getUsers() // Fetch the updated list of users after deletion
        })
        .catch((err) => {
          alert(err.message)
        })
    }
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users) // Use 'users' instead of 'suppliers'
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Users') // Rename the sheet as 'Users'
    XLSX.writeFile(wb, 'Users.xlsx')
  }
  const renderModal = () => (
    <div className="bg-gray-100 h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 w-96 rounded shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add New User</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">User Name</label>
          <input
            type="text"
            name="userName"
            placeholder="User Name"
            value={newUser.userName}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Contact No</label>
          <input
            type="text"
            name="contactNo"
            placeholder="Contact Number"
            value={newUser.contactNo}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Employee Code</label>
          <input
            type="text"
            name="employeeCode"
            placeholder="Employee Code"
            value={newUser.employeeCode}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Role</label>
          <select
            name="role"
            value={newUser.role}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          >
            <option value="">Select Role</option>
            <option value="Line Manager">Line Manager</option>
            <option value="Manager">Manager</option>
            <option value="Accounting Staff">Accounting Staff</option>
            <option value="Procurement Staff">Procurement Staff</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Management Code</label>
          <input
            type="text"
            name="managementCode"
            placeholder="Management Code"
            value={newUser.managementCode}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Department ID</label>
          <input
            type="number"
            name="departmentId"
            placeholder="Department ID"
            value={newUser.department.id}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Company ID</label>
          <input
            type="number"
            name="companyId"
            placeholder="Company ID"
            value={newUser.company.id}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>

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
  )

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
      <div className="flex justify-between items-center">
        <strong className="text-gray-700 font-medium">Users</strong>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add New User
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
              <th>Name</th>
              <th>Email</th>
              <th>Contact No</th>
              <th>Employee Code</th>
              <th>Role</th>
              <th>Management Code</th>
              <th>UserName</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.contactNo}</td>
                <td>{user.employeeCode}</td>
                <td>{user.role}</td>
                <td>{user.managementCode}</td>
                <td>{user.userName}</td>
                <td>{user.password}</td>
                <td>
                  <button
                    onClick={() => deleteUser(user.id)}
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
