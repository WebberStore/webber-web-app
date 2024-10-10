import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { Modal, Button } from 'react-bootstrap'

export default function Users() {
  const [users, setUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isUpdateSuccessOpen, setIsUpdateSuccessOpen] = useState(false)
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    password: '',
    role: 'Vendor',
  })

  const API_URL = process.env.REACT_APP_API_URL

  // Fetch all vendors from the API
  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user`)
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

  const handleUpdateChange = (e) => {
    const { name, value } = e.target
    setSelectedVendor((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/user`, newUser)
      setIsSuccessModalOpen(true)
      getUsers()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding user:', error)
    }
  }

  const handleUpdateVendor = async (e) => {
    e.preventDefault()
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user/${selectedVendor.id}`,
        selectedVendor
      )
      getUsers()
      setIsUpdateSuccessOpen(true)
      setIsUpdateModalOpen(false)
    } catch (error) {
      console.error('Error updating vendor:', error)
    }
  }

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/user/${id}`)
      getUsers()
      setIsDeleteModalOpen(false)
      setIsDeleteSuccessOpen(true)
    } catch (error) {
      console.error('Error deleting vendor:', error)
    }
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Users')
    XLSX.writeFile(wb, 'Users.xlsx')
  }

  const renderModal = () => (
    <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Vendor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
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
              value={newUser.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="d-flex justify-content-end mt-3">
            <Button type="submit" className="btn btn-primary">
              Add New Vendor
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )

  const renderUpdateModal = () => (
    <Modal show={isUpdateModalOpen} onHide={() => setIsUpdateModalOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Update Vendor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleUpdateVendor}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={selectedVendor?.email || ''}
              onChange={handleUpdateChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={selectedVendor?.name || ''}
              onChange={handleUpdateChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={selectedVendor?.password || ''}
              onChange={handleUpdateChange}
              className="form-control"
              required
            />
          </div>
          <div className="d-flex justify-content-end mt-3">
            <Button type="submit" className="btn btn-primary">
              Update Vendor
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )

  const renderDeleteModal = () => (
    <Modal show={isDeleteModalOpen} onHide={() => setIsDeleteModalOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this vendor?</p>
        <div className="d-flex justify-content-end">
          <Button
            onClick={() => deleteUser(selectedVendor.id)}
            className="btn btn-danger"
          >
            Yes, Delete
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )

  const renderSuccessModal = () => (
    <Modal
      show={isSuccessModalOpen}
      onHide={() => setIsSuccessModalOpen(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Success</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Vendor added successfully!</p>
      </Modal.Body>
    </Modal>
  )

  const renderUpdateSuccessModal = () => (
    <Modal
      show={isUpdateSuccessOpen}
      onHide={() => setIsUpdateSuccessOpen(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Success</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Vendor updated successfully!</p>
      </Modal.Body>
    </Modal>
  )

  const renderDeleteSuccessModal = () => (
    <Modal
      show={isDeleteSuccessOpen}
      onHide={() => setIsDeleteSuccessOpen(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Success</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Vendor deleted successfully!</p>
      </Modal.Body>
    </Modal>
  )

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Vendors</h3>
        <div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-success me-2"
          >
            Add New Vendor
          </Button>
          <Button onClick={exportToExcel} className="btn btn-primary">
            Export
          </Button>
        </div>
      </div>

      {isModalOpen && renderModal()}
      {isUpdateModalOpen && renderUpdateModal()}
      {isDeleteModalOpen && renderDeleteModal()}
      {isSuccessModalOpen && renderSuccessModal()}
      {isUpdateSuccessOpen && renderUpdateSuccessModal()}
      {isDeleteSuccessOpen && renderDeleteSuccessModal()}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>No</th>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index}</td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.rating}</td>
              <td>
                <button
                  onClick={() => {
                    setSelectedVendor(user)
                    setIsUpdateModalOpen(true)
                  }}
                  className="btn btn-primary me-2"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setSelectedVendor(user)
                    setIsDeleteModalOpen(true)
                  }}
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
