import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import axios from 'axios'

export default function Users() {
  const [users, setUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Vendor',
  })
  const [confirmDelete, setConfirmDelete] = useState(null)

  // Fetch all vendors from the API
  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5034/api/user')
      const vendors = response.data.filter((user) => user.role === 'Vendor')
      setUsers(vendors)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (window.confirm('Are you sure you want to add this vendor?')) {
      const payload = {
        Email: newUser.email,
        Name: newUser.name,
        Password: newUser.password,
        Role: 'Vendor',
      }
      try {
        await axios.post('http://localhost:5034/api/user', payload)
        setIsModalOpen(false)
        alert('Vendor added successfully!')
        getUsers() // Refresh the users after adding a new vendor
      } catch (error) {
        console.error('Error creating vendor:', error)
      }
    }
  }

  const confirmDeleteUser = (id) => {
    setConfirmDelete(id)
  }

  const deleteUser = async () => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await axios.delete(`http://localhost:5034/api/user/${confirmDelete}`)
        setConfirmDelete(null)
        alert('Vendor deleted successfully!')
        getUsers() // Refresh the users after deletion
      } catch (error) {
        console.error('Error deleting vendor:', error)
      }
    }
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Users')
    XLSX.writeFile(wb, 'Users.xlsx')
  }

  const renderModal = () => (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Vendor</h5>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Vendor Name"
                  value={newUser.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="d-flex justify-content-end mt-3">
                <button
                  type="submit"
                  style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
                  className="btn btn-primary me-2"
                >
                  Add New Vendor
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <h3>Vendors</h3>
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-success me-2"
            style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
          >
            Add New Vendor
          </button>
          <button onClick={exportToExcel} className="btn btn-primary">
            Export
          </button>
        </div>
      </div>

      {isModalOpen && renderModal()}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>No</th>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index}</td> {/* Custom numbering starting from 0 */}
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => confirmDeleteUser(user.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal for Deleting */}
      {confirmDelete && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this vendor?</p>
                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={deleteUser}
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setConfirmDelete(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
