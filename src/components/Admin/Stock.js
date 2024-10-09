import React, { useState } from 'react'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const Stock = () => {
  // Dummy data
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
  ])

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(5)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingStatus, setPendingStatus] = useState(null) // Store pending status change
  const [searchTerm, setSearchTerm] = useState('')

  // Pagination calculation
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = data
    .filter((row) =>
      row.product.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstRow, indexOfLastRow)

  const handleStatusChange = () => {
    setData((prevData) =>
      prevData.map((product) =>
        product.id === selectedProduct.id
          ? { ...product, status: pendingStatus }
          : product
      )
    )
    setShowModal(false)
    setShowConfirmation(false) // Close confirmation after action
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500'
      case 'Deactivate':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getRowColor = (quantity) => {
    if (quantity < 5) return 'bg-red-100'
    if (quantity >= 5 && quantity < 10) return 'bg-yellow-100'
    if (quantity >= 10) return ''
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

  return (
    <div className="p-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-3xl shadow-md flex items-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="blue"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c2.485 0 4.5-2.015 4.5-4.5S14.485 2 12 2 7.5 4.015 7.5 6.5 9.515 11 12 11zM12 13.5c-2.62 0-7.5 1.315-7.5 3.75V19.5c0 .828.672 1.5 1.5 1.5h12c.828 0 1.5-.672 1.5-1.5v-2.25c0-2.435-4.88-3.75-7.5-3.75z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Total Items</h3>
            <p className="text-black text-2xl font-bold">125</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-md flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="orange"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c2.485 0 4.5-2.015 4.5-4.5S14.485 2 12 2 7.5 4.015 7.5 6.5 9.515 11 12 11zM12 13.5c-2.62 0-7.5 1.315-7.5 3.75V19.5c0 .828.672 1.5 1.5 1.5h12c.828 0 1.5-.672 1.5-1.5v-2.25c0-2.435-4.88-3.75-7.5-3.75z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Profit</h3>
            <p className="text-black text-2xl font-bold">Rs.100,000.00</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-md flex items-center">
          <div className="bg-red-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="red"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c2.485 0 4.5-2.015 4.5-4.5S14.485 2 12 2 7.5 4.015 7.5 6.5 9.515 11 12 11zM12 13.5c-2.62 0-7.5 1.315-7.5 3.75V19.5c0 .828.672 1.5 1.5 1.5h12c.828 0 1.5-.672 1.5-1.5v-2.25c0-2.435-4.88-3.75-7.5-3.75z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Low On Stock</h3>
            <p className="text-black text-2xl font-bold">111</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-md flex items-center">
          <div className="bg-teal-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="teal"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c2.485 0 4.5-2.015 4.5-4.5S14.485 2 12 2 7.5 4.015 7.5 6.5 9.515 11 12 11zM12 13.5c-2.62 0-7.5 1.315-7.5 3.75V19.5c0 .828.672 1.5 1.5 1.5h12c.828 0 1.5-.672 1.5-1.5v-2.25c0-2.435-4.88-3.75-7.5-3.75z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Categories</h3>
            <p className="text-black text-2xl font-bold">24</p>
          </div>
        </div>
      </div>

      {/* Wrap the entire content in a white card */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        {/* Search Input and Download PDF Button (Inlined) */}
        <div className="mb-4 flex justify-between items-center">
          {/* Search Input */}
          <input
            type="text"
            className="border rounded-lg p-2 w-2/3"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Download PDF Button */}
          <button
            onClick={downloadPDF}
            className="bg-[#6362B5] text-white py-2 px-4 rounded ml-4"
          >
            Download PDF
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">No</th>
                <th className="py-2 px-4 border-b">Product</th>
                <th className="py-2 px-4 border-b">Product ID</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Vender</th>
                <th className="py-2 px-4 border-b">Buying Price</th>
                <th className="py-2 px-4 border-b">Selling Price</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((product, index) => (
                <tr key={product.id} className={getRowColor(product.quantity)}>
                  <td className="py-2 px-4 border-b">
                    {index + 1 + (currentPage - 1) * rowsPerPage}
                  </td>
                  <td className="py-2 px-4 border-b">{product.product}</td>
                  <td className="py-2 px-4 border-b">{product.productID}</td>
                  <td className="py-2 px-4 border-b">{product.quantity}</td>
                  <td className="py-2 px-4 border-b">{product.category}</td>
                  <td className="py-2 px-4 border-b">{product.vendor}</td>
                  <td className="py-2 px-4 border-b">
                    Rs.{product.buyingPrice}.00
                  </td>
                  <td className="py-2 px-4 border-b">
                    Rs.{product.sellingPrice}.00
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className={`py-1 px-3 rounded-full text-white ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => {
                        setSelectedProduct(product)
                        setShowModal(true)
                      }}
                      className="bg-[#6362B5] text-white py-1 px-3 rounded"
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
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-gray-200 p-2 rounded-lg"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="self-center">
            Page {currentPage} of {Math.ceil(data.length / rowsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(data.length / rowsPerPage))
              )
            }
            className="bg-gray-200 p-2 rounded-lg"
            disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {showModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowModal(false)
                  setShowConfirmation(false) // Reset confirmation state
                }}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-xl font-bold mb-4">
                Change Status for {selectedProduct.product}
              </h2>

              {!showConfirmation ? (
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => {
                      setPendingStatus('Active')
                      setShowConfirmation(true) // Show confirmation
                    }}
                    className="bg-green-500 text-white py-2 px-4 rounded w-full"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => {
                      setPendingStatus('Deactivate')
                      setShowConfirmation(true) // Show confirmation
                    }}
                    className="bg-red-500 text-white py-2 px-4 rounded w-full"
                  >
                    Deactivate
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to {pendingStatus.toLowerCase()} this
                    product?
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleStatusChange}
                      className="bg-green-500 text-white py-2 px-4 rounded"
                    >
                      Yes, {pendingStatus}
                    </button>
                    <button
                      onClick={() => setShowConfirmation(false)} // Go back to status selection
                      className="bg-gray-500 text-white py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Stock
