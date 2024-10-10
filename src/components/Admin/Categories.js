import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import axios from 'axios'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false) // Separate state for form modal
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({ name: '', status: true })
  const [currentPage, setCurrentPage] = useState(1) // Pagination state
  const [confirmMessage, setConfirmMessage] = useState(null) // Confirmation state

  const itemsPerPage = 10 // Number of rows per page

  // Fetch categories from API
  useEffect(() => {
    getCategories()
  }, [])

  const getCategories = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5034/api/products/category'
      )
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewCategory((prev) => ({ ...prev, [name]: value }))
  }

  // Create new category
  const handleSubmit = async (e) => {
    e.preventDefault()
    setConfirmMessage({
      message: 'Are you sure you want to add this category?',
      onConfirm: async () => {
        try {
          await axios.post(
            'http://localhost:5034/api/products/category',
            newCategory
          )
          getCategories() // Refresh categories list after addition
          setIsFormModalOpen(false)
          setConfirmMessage(null)
          alert('Category added successfully!')
        } catch (error) {
          console.error('Error adding category:', error)
        }
      },
    })
  }

  // Open modal for viewing category
  const handleViewClick = (category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  // Update category status
  const handleStatusChange = async (newStatus) => {
    setConfirmMessage({
      message: `Are you sure you want to change the status to ${
        newStatus ? 'Active' : 'Deactive'
      }?`,
      onConfirm: async () => {
        try {
          await axios.put(
            `http://localhost:5034/api/products/category/${selectedCategory.id}`,
            { ...selectedCategory, status: newStatus }
          )
          setIsModalOpen(false)
          setConfirmMessage(null)
          getCategories() // Refresh categories list after status change
          alert('Status updated successfully!')
        } catch (error) {
          console.error('Error updating status:', error)
        }
      },
    })
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(categories)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Categories')
    XLSX.writeFile(wb, 'Categories.xlsx')
  }

  const renderModal = () => (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">View Category</h5>
          </div>
          <div className="modal-body">
            <p>Category Name: {selectedCategory?.name}</p>
            <p>Status: {selectedCategory?.status ? 'Active' : 'Deactive'}</p>

            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-success"
                disabled={selectedCategory?.status}
                onClick={() => handleStatusChange(true)}
              >
                Activate
              </button>
              <button
                className="btn btn-danger"
                disabled={!selectedCategory?.status}
                onClick={() => handleStatusChange(false)}
              >
                Deactivate
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderFormModal = () => (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Category</h5>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Category Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter category name"
                  value={newCategory.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label>Status</label>
                <select
                  name="status"
                  value={newCategory.status}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value={true}>Active</option>
                  <option value={false}>Deactive</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
                >
                  Add Category
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsFormModalOpen(false)}
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

  // Pagination logic
  const totalPages = Math.ceil(categories.length / itemsPerPage)
  const currentItems = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const renderPagination = () => (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
        </li>
        {Array.from({ length: totalPages }, (_, i) => (
          <li
            key={i + 1}
            className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
          >
            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === totalPages || totalPages === 0 ? 'disabled' : ''
          }`}
        >
          <button
            className="page-link"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  )

  // Confirmation modal
  const renderConfirmModal = () =>
    confirmMessage && (
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmation</h5>
            </div>
            <div className="modal-body">
              <p>{confirmMessage.message}</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
                  confirmMessage.onConfirm()
                  setConfirmMessage(null)
                }}
              >
                Confirm
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmMessage(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between mb-3">
        <h3>Categories</h3>
        <div>
          <button
            onClick={() => setIsFormModalOpen(true)} // Show form modal
            className="btn btn-success me-2"
            style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
          >
            Add New Category
          </button>
          <button onClick={exportToExcel} className="btn btn-primary">
            Export
          </button>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && selectedCategory && renderModal()}
      {isFormModalOpen && renderFormModal()}
      {renderConfirmModal()}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Category ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((category, index) => (
            <tr key={category.id}>
              <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>{' '}
              {/* Custom ID */}
              <td>{category.name}</td>
              <td>{category.status ? 'Active' : 'Deactive'}</td>
              <td>{new Date(category.createdAt).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handleViewClick(category)}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
                >
                  Action
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {renderPagination()}
    </div>
  )
}
