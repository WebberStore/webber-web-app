import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'

export default function Users() {
  const [users, setUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    city: '',
    role: 'Vendor',
    password: '',
  })

  // Simulating fetching users from a dummy API
  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = () => {
    // Simulate an API call
    setTimeout(() => {
      const dummyUsers = [
        {
          id: 1,
          userName: 'JohnDoe',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          contactNo: '1234567890',
          role: 'Vendor',
          city: 'Colombo',
          password: 'password123',
        },
      ]
      setUsers(dummyUsers)
    }, 1000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (window.confirm('Are you sure you want to add this vendor?')) {
      setUsers((prevUsers) => [
        ...prevUsers,
        { ...newUser, id: prevUsers.length + 1 },
      ])
      setIsModalOpen(false)
      alert('Vendor added successfully!')
    }
  }

  const deleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
      alert('Vendor deleted successfully!')
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
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={newUser.firstName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={newUser.lastName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>User Name</label>
                <input
                  type="text"
                  name="userName"
                  placeholder="User Name"
                  value={newUser.userName}
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
                <label>Contact No</label>
                <input
                  type="text"
                  name="contactNo"
                  placeholder="Contact Number"
                  value={newUser.contactNo}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="Vendor">Vendor</option>
                </select>
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={newUser.city}
                  onChange={handleChange}
                  className="form-control"
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
            <th>Vendor ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Contact No</th>
            <th>Role</th>
            <th>City</th>
            <th>UserName</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.contactNo}</td>
              <td>{user.role}</td>
              <td>{user.city}</td>
              <td>{user.userName}</td>
              <td>{user.password}</td>
              <td>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
