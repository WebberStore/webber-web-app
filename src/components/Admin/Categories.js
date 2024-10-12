import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({ name: '', status: true })
  const [currentPage, setCurrentPage] = useState(1)
  const [confirmMessage, setConfirmMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  // api endpoint calling from env file----------------------------------------------------
  const API_URL = process.env.REACT_APP_API_URL

  // variable for pagination-----------------------------------------------
  const itemsPerPage = 10
  const totalPages = Math.ceil(categories.length / itemsPerPage)
  const currentItems = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // pagination logic----------------------------------------------------------------------
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

  useEffect(() => {
    getCategories()
  }, [])

  // API call for retriew all categories---------------------------------------------------------------------------------------------
  const getCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/category`)
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewCategory((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setImageFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage(null)
    const formData = new FormData()
    formData.append('name', newCategory.name)
    formData.append('status', newCategory.status)
    if (imageFile) {
      formData.append('imageFile', imageFile)
    }

    // post request for new category creation----------------------------------------------------------------
    setConfirmMessage({
      message: 'Are you sure you want to add this category?',
      onConfirm: async () => {
        try {
          await axios.post(`${API_URL}/api/products/category`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          getCategories()
          setIsFormModalOpen(false)
          setConfirmMessage(null)
          alert('Category added successfully!')
        } catch (error) {
          if (error.response && error.response.status === 400) {
            const errors = error.response.data.errors
            if (errors) {
              const errorMessage = Object.values(errors).flat().join(', ')
              setErrorMessage(errorMessage)
            } else {
              setErrorMessage('An unexpected error occurred.')
            }
          } else {
            console.error('Error adding category:', error)
            setErrorMessage('Error adding category. Please try again.')
          }
        }
      },
    })
  }

  const handleViewClick = (category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleUpdateClick = (category) => {
    setSelectedCategory(category)
    setNewCategory({ name: category.name, status: category.status })
    setImageFile(null)
    setIsUpdateModalOpen(true)
  }

  // category status update--------------------------------------------------------------------
  const handleStatusChange = async (newStatus) => {
    setErrorMessage(null)
    setConfirmMessage({
      message: `Are you sure you want to change the status to ${
        newStatus ? 'Active' : 'Deactive'
      }?`,
      onConfirm: async () => {
        try {
          const formData = new FormData()
          formData.append('name', selectedCategory.name)
          formData.append('status', newStatus)
          if (selectedCategory.imageFile) {
            formData.append('imageFile', selectedCategory.imageFile)
          }

          await axios.put(
            `${API_URL}/api/products/category/${selectedCategory.id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )

          setIsModalOpen(false)
          setConfirmMessage(null)
          getCategories()
        } catch (error) {
          if (error.response) {
            console.error('Error Response:', error.response)
            if (error.response.data && error.response.data.errors) {
              const errors = error.response.data.errors
              const errorMessage = Object.values(errors).flat().join(', ')
              setErrorMessage(errorMessage)
            } else {
              setErrorMessage('An unexpected error occurred.')
            }
          } else {
            console.error('Error updating status:', error)
            setErrorMessage('Error updating status. Please try again.')
          }
        }
      },
    })
  }

  // category detils update--------------------------------------------------------------------------------------------------------
  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage(null)
    const formData = new FormData()
    formData.append('name', newCategory.name)
    formData.append('status', newCategory.status)
    if (imageFile) {
      formData.append('imageFile', imageFile)
    }

    try {
      await axios.put(
        `${API_URL}/api/products/category/${selectedCategory.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      setIsUpdateModalOpen(false)
      getCategories()
      alert('Category updated successfully!')
    } catch (error) {
      console.error('Error updating category:', error)
      setErrorMessage('Error updating category. Please try again.')
    }
  }

  // pdf export--------------------------------------------------------------------
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(categories)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Categories')
    XLSX.writeFile(wb, 'Product Categories.xlsx')
  }

  // pop up window for status handeling----------------------------------------------------------------
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

  // model for new categories creation form----------------------------------------------------------------
  const renderFormModal = () => (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Category</h5>
          </div>
          <div className="modal-body">
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}
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

              <div className="form-group mb-3">
                <label>Upload Image</label>
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-control"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="submit"
                  size="sm"
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

  // model for updating-------------------------------------------------------------------------
  const renderUpdateModal = () => (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Category</h5>
          </div>
          <div className="modal-body">
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}
            <form onSubmit={handleUpdateSubmit}>
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
                <label>Upload New Image (Optional)</label>
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-control"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-primary"
                  size="sm"
                  style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
                >
                  Update Category
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsUpdateModalOpen(false)}
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

  // confirmation message handeling model----------------------------------------------------------------
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
            onClick={() => setIsFormModalOpen(true)}
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

      {isModalOpen && selectedCategory && renderModal()}
      {isFormModalOpen && renderFormModal()}
      {isUpdateModalOpen && renderUpdateModal()}
      {renderConfirmModal()}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Category ID</th>
            <th>Image</th>
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
              {/* image handeling */}
              <td>
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="rounded-circle"
                  style={{ width: '50px', height: '50px' }}
                />
              </td>
              <td>{category.name}</td>
              <td>{category.status ? 'Active' : 'Deactive'}</td>
              <td>{new Date(category.createdAt).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handleViewClick(category)}
                  className="btn btn-primary"
                  size="sm"
                  style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
                >
                  Action
                </button>{' '}
                <button
                  size="sm"
                  onClick={() => handleUpdateClick(category)}
                  className="btn btn-warning"
                >
                  Update
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
