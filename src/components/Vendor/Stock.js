import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import 'bootstrap/dist/css/bootstrap.min.css'

const Stock = () => {
  const [data, setData] = useState([])
  const [categories, setCategories] = useState([])
  const [lowStockCount, setLowStockCount] = useState(0)
  const [totalStockValue, setTotalStockValue] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(5)
  const [selectedProduct, setSelectedProduct] = useState(null)
  // action modal (Update/Delete)---------------------------------------------------
  const [showModal, setShowModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [apiResponseMessage, setApiResponseMessage] = useState('')

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    author: '',
    price: '',
    stock: '',
    categoryId: '',
    vendorId: localStorage.getItem('vendorid'),
  })
  // for storing the image file---------------------------------
  const [imageFile, setImageFile] = useState(null)

  // api endpoints----------------------------------------------------
  const API_URL = process.env.REACT_APP_API_URL
  const vendorId = localStorage.getItem('vendorid')

  // fetch products and categories from API --------------------------------------------
  useEffect(() => {
    getProducts()
    getCategories()
  }, [])

  // retrieve app products relevent to vendor id-----------------------------------------
  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/products/vendor/${vendorId}`
      )
      setData(response.data)
      calculateLowStockCount(response.data)
      calculateTotalStockValue(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // get all categories------------------------------------
  const getCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/category`)
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // calculate low stock logic-------------------------------------------------------------
  const calculateLowStockCount = (products) => {
    const count = products.filter((product) => product.stock < 10).length
    setLowStockCount(count)
  }

  // calculation for total product worth----------------------------------------------------------------
  const calculateTotalStockValue = (products) => {
    const totalValue = products.reduce(
      (acc, product) => acc + product.stock * product.price,
      0
    )
    setTotalStockValue(totalValue)
  }

  // handle form input changes for new and update forms----------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({ ...prev, [name]: value }))
  }

  // handle form input changes for updating products----------------------------------------------------------------
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target
    setSelectedProduct((prev) => ({ ...prev, [name]: value }))
  }

  // handle image file selection-------------------------------------------------------------
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0])
  }

  // create new product-------------------------------------------------------------
  const createProduct = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', newProduct.name)
    formData.append('description', newProduct.description)
    formData.append('author', newProduct.author)
    formData.append('price', newProduct.price)
    formData.append('stock', newProduct.stock)
    formData.append('categoryId', newProduct.categoryId)
    formData.append('vendorId', newProduct.vendorId)
    formData.append('imageFile', imageFile)

    try {
      await axios.post(`${API_URL}/api/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      // refresh product list after creation----------------------------------------------------------------
      getProducts()
      setShowAddProduct(false)
      alert('Product added successfully!')
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  // update a product----------------------------------------------------
  const handleUpdate = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', selectedProduct.name)
    formData.append('description', selectedProduct.description)
    formData.append('author', selectedProduct.author)
    formData.append('price', selectedProduct.price)
    formData.append('stock', selectedProduct.stock)
    formData.append('categoryId', selectedProduct.category.id)
    formData.append('vendorId', selectedProduct.vendor.id)

    // if a new image is selected, append it to the form data----------------------------------------------------------------
    if (imageFile) {
      formData.append('imageFile', imageFile)
    }

    try {
      await axios.put(
        `${API_URL}/api/products/${selectedProduct.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      getProducts()
      setShowUpdateModal(false)
      setShowModal(false)
      alert('Product updated successfully!')
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  // product deletion---------------------------------------------
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/products/${selectedProduct.id}`
      )

      if (response.data.message) {
        setApiResponseMessage(response.data.message)
      } else {
        setApiResponseMessage('Product deleted successfully!')
      }

      getProducts()
    } catch (error) {
      // capture the exact error response text and show it in the modal----------------------------------------------------------------
      if (error.response && error.response.data) {
        setApiResponseMessage(error.response.data) // show exact API error message----------------------------------------------------------------
      } else {
        setApiResponseMessage('An error occurred. Please try again.')
      }
    }

    setShowConfirmation(false)
    setShowModal(true)
  }

  // open action modal and set selected product----------------------------------------------
  const handleActionClick = (product) => {
    setSelectedProduct(product)
    setShowModal(true)
  }

  const handleUpdateAction = () => {
    setShowModal(false)
    setShowUpdateModal(true)
  }

  // pagination calculation----------------------------------------------------------------
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = data
    .filter((row) => row.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(indexOfFirstRow, indexOfLastRow)

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.autoTable({
      head: [
        [
          'Product Name',
          'Stock',
          'Description',
          'Author',
          'Price',
          'Category',
          'Vendor',
        ],
      ],
      body: data.map((product) => [
        product.name,
        product.stock,
        product.description,
        product.author,
        `Rs.${product.price.toFixed(2)}`,
        product.category.name,
        product.vendor.name,
      ]),
    })
    doc.save('stock_table.pdf')
  }

  const getRowColor = (stock) => {
    if (stock < 5) {
      // red for stock < 5--------------------------------------
      return 'bg-danger text-white'
    } else if (stock >= 5 && stock < 10) {
      // yellow for stock between 5 and 10------------------------
      return 'bg-warning text-dark'
    } else {
      //stock >= 10 - default color-------------------------
      return ''
    }
  }

  const actionButtons = () => (
    <div className="d-flex justify-content-around">
      <button className="btn btn-primary" onClick={handleUpdateAction}>
        Update
      </button>
      <button
        className="btn btn-danger"
        onClick={() => {
          setPendingAction('Delete')
          setShowConfirmation(true)
        }}
      >
        Delete
      </button>
    </div>
  )

  const confirmationPrompt = () => (
    <div className="text-center mt-3">
      {pendingAction === 'Delete' ? (
        <>
          <p className="text-danger">
            Are you sure you want to delete this product?
          </p>
          <button className="btn btn-danger me-2" onClick={handleDelete}>
            Yes, Delete
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </button>
        </>
      ) : null}
    </div>
  )

  return (
    <div className="container" style={{ backgroundColor: '#fff' }}>
      {/* ------------------------------------summary cards--------------------------------------------- */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Items</h5>
              <p className="card-text">{data.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Categories</h5>
              <p className="card-text">{categories.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Low On Stock</h5>
              <p className="card-text">{lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Stock Value</h5>
              <p className="card-text">Rs.{totalStockValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex justify-content-end">
          <button
            onClick={() => setShowAddProduct(true)}
            className="btn btn-success me-2"
            style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
          >
            Add Product
          </button>
          <button onClick={downloadPDF} className="btn btn-primary">
            Download PDF
          </button>
        </div>
      </div>
      {/* ---------------------------------------datatable------------------------------------------------- */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>No</th>
              <th>Image</th>
              <th>Product Name</th>
              <th>Stock</th>
              <th>Description</th>
              <th>Author</th>
              <th>Price</th>
              <th>Category Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((product, index) => (
              <tr key={product.id} className={getRowColor(product.stock)}>
                <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                <td>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="rounded-circle"
                    style={{ width: '50px', height: '50px' }}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.stock}</td>
                <td>{product.description}</td>
                <td>{product.author}</td>
                <td>Rs.{product.price}.00</td>
                <td>{product.category.name}</td>
                <td>
                  <span
                    className={`badge ${
                      product.category.status ? 'bg-success' : 'bg-secondary'
                    }`}
                  >
                    {product.category.status ? 'Active' : 'Deactive'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    // open action modal----------------------------------------------------------------
                    onClick={() => handleActionClick(product)}
                    size="sm"
                    style={{
                      backgroundColor: '#6362b5',
                      borderColor: '#6362b5',
                    }}
                  >
                    Action
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* --------------------------------------------------pagination-------------------------------------------------- */}
      <div className="d-flex justify-content-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="btn btn-secondary"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="align-self-center">
          Page {currentPage} of {Math.ceil(data.length / rowsPerPage)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(data.length / rowsPerPage))
            )
          }
          className="btn btn-secondary"
          disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
        >
          Next
        </button>
      </div>

      {showModal && selectedProduct && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Actions for {selectedProduct.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* -------------------------------------------------------show the exact API response (success or error)-------------------------------------------- */}
                {apiResponseMessage && (
                  <div
                    className={`alert ${
                      apiResponseMessage.includes('Cannot')
                        ? 'alert-danger'
                        : 'alert-success'
                    }`}
                  >
                    {apiResponseMessage}
                  </div>
                )}

                {!showConfirmation && actionButtons()}

                {showConfirmation && confirmationPrompt()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------add product modal---------------------------------------------------------- */}
      {showAddProduct && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddProduct(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={createProduct}>
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      placeholder="Enter product description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Author</label>
                    <input
                      type="text"
                      className="form-control"
                      name="author"
                      placeholder="Enter Author"
                      value={newProduct.author}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      placeholder="Enter product price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      name="stock"
                      placeholder="Enter stock quantity"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-control"
                      name="categoryId"
                      value={newProduct.categoryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Upload Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAddProduct(false)}
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#6362b5',
                        borderColor: '#6362b5',
                      }}
                      className="btn btn-primary"
                    >
                      Add Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* -----------------------------------------------------------update product modal--------------------------------------------------------- */}
      {showUpdateModal && selectedProduct && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUpdateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdate}>
                  {/* ------------------------------------------------------update product form---------------------------------------------------------- */}
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={selectedProduct.name}
                      onChange={handleUpdateInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={selectedProduct.description}
                      onChange={handleUpdateInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Author</label>
                    <input
                      type="text"
                      className="form-control"
                      name="author"
                      value={selectedProduct.author}
                      onChange={handleUpdateInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={selectedProduct.price}
                      onChange={handleUpdateInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input
                      readOnly
                      type="number"
                      className="form-control"
                      name="stock"
                      value={selectedProduct.stock}
                      onChange={handleUpdateInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-control"
                      name="categoryId"
                      value={selectedProduct.category.id}
                      onChange={handleUpdateInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Upload Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowUpdateModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Stock
