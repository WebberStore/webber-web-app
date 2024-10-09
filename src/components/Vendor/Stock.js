import React, { useState } from 'react'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import 'bootstrap/dist/css/bootstrap.min.css'

const Stock = () => {
  const [data, setData] = useState([
    {
      id: 1,
      product: 'Men T-shirt Black',
      productID: 'SN00012',
      quantity: 15,
      category: 'Mens',
      vendor: 'Kamal',
      buyingPrice: 1540,
      sellingPrice: 1540,
      status: 'Active',
    },
    {
      id: 2,
      product: 'Men T-shirt Blue',
      productID: 'SN00002',
      quantity: 10,
      category: 'Mens',
      vendor: 'Silva',
      buyingPrice: 1540,
      sellingPrice: 1540,
      status: 'Deactivate',
    },
    {
      id: 3,
      product: 'Cap Red',
      productID: 'SN00025',
      quantity: 5,
      category: 'Accessories',
      vendor: 'Shani',
      buyingPrice: 2100,
      sellingPrice: 2100,
      status: 'Deactivate',
    },
    {
      id: 4,
      product: 'Women Denim',
      productID: 'SN00005',
      quantity: 4,
      category: 'Women',
      vendor: 'Kamal',
      buyingPrice: 5400,
      sellingPrice: 5400,
      status: 'Deactivate',
    },
    {
      id: 5,
      product: 'Women Shirt',
      productID: 'SN00024',
      quantity: 11,
      category: 'Women',
      vendor: 'Kamal',
      buyingPrice: 2400,
      sellingPrice: 2400,
      status: 'Active',
    },
    {
      id: 4,
      product: 'Women Denim',
      productID: 'SN00005',
      quantity: 4,
      category: 'Women',
      vendor: 'Kamal',
      buyingPrice: 5400,
      sellingPrice: 5400,
      status: 'Deactivate',
    },
    {
      id: 5,
      product: 'Women Shirt',
      productID: 'SN00024',
      quantity: 11,
      category: 'Women',
      vendor: 'Kamal',
      buyingPrice: 2400,
      sellingPrice: 2400,
      status: 'Active',
    },
  ])

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(5)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false) // For Add Product form
  const [pendingAction, setPendingAction] = useState(null) // Store pending action
  const [searchTerm, setSearchTerm] = useState('')

  // Pagination calculation
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = data
    .filter((row) =>
      row.product.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstRow, indexOfLastRow)

  const handleDelete = () => {
    setData((prevData) =>
      prevData.filter((product) => product.id !== selectedProduct.id)
    )
    setShowModal(false)
    setShowConfirmation(false) // Close confirmation after action
  }

  const handleUpdate = () => {
    setData((prevData) =>
      prevData.map((product) =>
        product.id === selectedProduct.id ? selectedProduct : product
      )
    )
    setShowModal(false) // Close the modal
  }

  const confirmUpdate = () => {
    setShowConfirmation(false)
    // Trigger update form after confirmation
    setPendingAction('UpdateForm')
  }

  const confirmDelete = () => {
    setShowConfirmation(false)
    // Trigger delete after confirmation
    handleDelete()
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.autoTable({
      head: [
        [
          'Product',
          'Product ID',
          'Quantity',
          'Category',
          'Vendor',
          'Buying Price',
          'Selling Price',
        ],
      ],
      body: data.map((product) => [
        product.product,
        product.productID,
        product.quantity,
        product.category,
        product.vendor,
        `Rs.${product.buyingPrice.toFixed(2)}`,
        `Rs.${product.sellingPrice.toFixed(2)}`,
      ]),
    })
    doc.save('stock_table.pdf')
  }

  const getRowColor = (quantity) => {
    if (quantity < 5) {
      return 'bg-danger text-white'
    } else if (quantity >= 5 && quantity <= 10) {
      return 'bg-warning text-dark'
    }
    return ''
  }

  const actionButtons = () => (
    <div className="d-flex justify-content-around">
      <button
        className="btn btn-primary"
        onClick={() => {
          setPendingAction('Update')
          setShowConfirmation(true)
        }}
      >
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
          <button className="btn btn-danger me-2" onClick={confirmDelete}>
            Yes, Delete
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </button>
        </>
      ) : pendingAction === 'Update' ? (
        <>
          <p className="text-primary">
            Are you sure you want to update this product?
          </p>
          <button className="btn btn-primary me-2" onClick={confirmUpdate}>
            Yes, Update
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

  const addProductForm = () => {
    return (
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
              {/* Image Upload */}
              <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg text-center mb-4">
                <div className="mb-2">Drag image here</div>
                <div className="text-primary text-decoration-underline cursor-pointer">
                  Browse image
                </div>
              </div>
              {/* Product Name */}
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter product name"
                />
              </div>
              {/* Product ID */}
              <div className="mb-3">
                <label className="form-label">Product ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter product ID"
                />
              </div>
              {/* Category */}
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select className="form-select">
                  <option>Select product category</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              {/* Buying Price */}
              <div className="mb-3">
                <label className="form-label">Buying Price</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter buying price"
                />
              </div>
              {/* Quantity */}
              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter product quantity"
                />
              </div>
              {/* Selling Price */}
              <div className="mb-3">
                <label className="form-label">Selling Price</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter selling price"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowAddProduct(false)}
              >
                Discard
              </button>
              <button type="button" className="btn btn-primary">
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const updateProductForm = () => {
    return (
      <div className="modal show fade d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Product</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowModal(false)
                  setPendingAction(null) // Reset action to hide update form
                }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedProduct?.product || ''}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      product: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Product ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedProduct?.productID || ''}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      productID: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedProduct?.category || ''}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      category: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedProduct?.quantity || ''}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Buying Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedProduct?.buyingPrice || ''}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      buyingPrice: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Selling Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedProduct?.sellingPrice || ''}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      sellingPrice: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowModal(false)
                  setPendingAction(null) // Reset action to hide update form
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ backgroundColor: '#f5f7fa' }}>
      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div
                className="rounded-circle bg-light p-3 mx-auto mb-2"
                style={{ width: '50px', height: '50px' }}
              >
                <i
                  className="fas fa-user text-primary"
                  style={{ fontSize: '24px' }}
                ></i>
              </div>
              <h6 className="text-muted">Total Items</h6>
              <p className="h3 font-weight-bold">125</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div
                className="rounded-circle bg-light p-3 mx-auto mb-2"
                style={{ width: '50px', height: '50px' }}
              >
                <i
                  className="fas fa-briefcase text-warning"
                  style={{ fontSize: '24px' }}
                ></i>
              </div>
              <h6 className="text-muted">Profit</h6>
              <p className="h3 font-weight-bold">Rs.100,000.00</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div
                className="rounded-circle bg-light p-3 mx-auto mb-2"
                style={{ width: '50px', height: '50px' }}
              >
                <i
                  className="fas fa-chart-line text-danger"
                  style={{ fontSize: '24px' }}
                ></i>
              </div>
              <h6 className="text-muted">Low On Stock</h6>
              <p className="h3 font-weight-bold">111</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div
                className="rounded-circle bg-light p-3 mx-auto mb-2"
                style={{ width: '50px', height: '50px' }}
              >
                <i
                  className="fas fa-tools text-info"
                  style={{ fontSize: '24px' }}
                ></i>
              </div>
              <h6 className="text-muted">Categories</h6>
              <p className="h3 font-weight-bold">24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input and Buttons */}
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
          >
            Add Product
          </button>
          <button onClick={downloadPDF} className="btn btn-primary">
            Download PDF
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>No</th>
              <th>Product</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Category</th>
              <th>Vendor</th>
              <th>Buying Price</th>
              <th>Selling Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((product, index) => (
              <tr key={product.id} className={getRowColor(product.quantity)}>
                <td>{index + 1}</td>
                <td>{product.product}</td>
                <td>{product.productID}</td>
                <td>{product.quantity}</td>
                <td>{product.category}</td>
                <td>{product.vendor}</td>
                <td>Rs.{product.buyingPrice}.00</td>
                <td>Rs.{product.sellingPrice}.00</td>
                <td>
                  <span className="badge bg-secondary">{product.status}</span>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedProduct(product)
                      setShowModal(true)
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

      {/* Pagination */}
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

      {/* Action Modal */}
      {showModal && selectedProduct && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Actions for {selectedProduct.product}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {showConfirmation ? confirmationPrompt() : actionButtons()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && addProductForm()}

      {/* Update Form Modal */}
      {pendingAction === 'UpdateForm' && updateProductForm()}
    </div>
  )
}

export default Stock
