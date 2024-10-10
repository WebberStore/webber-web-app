import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Tabs,
  Tab,
  InputGroup,
  FormControl,
  Pagination,
  Modal,
} from 'react-bootstrap'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const Orders = () => {
  const [key, setKey] = useState('newOrders') // Tab state
  const [showModal, setShowModal] = useState(false) // Modal state
  const [selectedOrder, setSelectedOrder] = useState(null) // Store selected order
  const [showConfirmModal, setShowConfirmModal] = useState(false) // Confirmation modal state
  const [searchTerm, setSearchTerm] = useState('') // Search functionality
  const [currentPage, setCurrentPage] = useState(1) // Pagination state
  const [orders, setOrders] = useState([]) // Store orders
  const ordersPerPage = 10

  const API_URL = process.env.REACT_APP_API_URL
  const vendorId = '66fabea22165a016474e7a6e'

  // Fetch orders from API
  useEffect(() => {
    fetch(`${API_URL}/api/order/item/vendor/${vendorId}`) // Example URL
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.log(error))
  }, [])

  // Filter orders based on tab and search term
  const filteredOrders = orders
    .filter((order) => {
      if (key === 'newOrders' && order.status === 'Pending') return true
      if (key === 'deliveredOrders' && order.status === 'Delivered') return true
      return false
    })
    .filter((order) => {
      return (
        order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

  // Pagination setup
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  )
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowModal(true) // Show modal when "View" is clicked
  }

  // Update the order status to "Delivered"
  const handleDelivered = (order) => {
    fetch(`${API_URL}api/order/item/status/${order.id}?status=Delivered`, {
      method: 'PUT',
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedOrders = orders.map((o) =>
          o.id === order.id ? { ...o, status: 'Delivered' } : o
        )
        setOrders(updatedOrders)
        setShowModal(false) // Close the main modal after update
        setShowConfirmModal(false) // Close confirmation modal after update
      })
      .catch((error) => console.log(error))
  }

  // Download PDF function for main data table
  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Orders Report', 14, 10)
    doc.autoTable({
      startY: 20,
      head: [['No', 'Product', 'Quantity', 'Total Amount', 'Status']],
      body: filteredOrders.map((order, index) => [
        index + 1,
        order.product.name,
        order.quantity,
        `Rs. ${order.totalPrice}`,
        order.status,
      ]),
    })
    doc.save('orders_report.pdf')
  }

  // Download PDF for the modal (Order details)
  const downloadOrderDetailsPDF = (order) => {
    const doc = new jsPDF()
    doc.text(`Order ID: ${order.orderId}`, 14, 10)
    doc.autoTable({
      startY: 20,
      head: [['No', 'Product Name', 'Quantity', 'Total Price']],
      body: [
        [1, order.product.name, order.quantity, `Rs. ${order.totalPrice}`],
      ],
    })
    doc.save('order_details.pdf')
  }

  return (
    <div className="container mt-2">
      <h3>Orders</h3>

      {/* Tabs for toggling between orders */}
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="newOrders" title="New Orders" />
        <Tab eventKey="deliveredOrders" title="Delivered Orders" />
      </Tabs>

      {/* Search and download functionality */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search orders..."
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
          onClick={downloadPDF}
        >
          Download PDF
        </Button>
      </InputGroup>

      {/* Data Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order, index) => (
            <tr key={order.id}>
              <td>{indexOfFirstOrder + index + 1}</td>
              <td>{order.product.name}</td>
              <td>{order.quantity}</td>
              <td>{`Rs. ${order.totalPrice}`}</td>
              <td>
                <Button
                  variant={
                    order.status === 'Pending'
                      ? 'secondary'
                      : order.status === 'Delivered'
                      ? 'success'
                      : 'danger'
                  }
                  size="sm"
                >
                  {order.status}
                </Button>
              </td>
              <td>
                <Button
                  style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }} // Custom color
                  size="sm"
                  onClick={() => handleViewOrder(order)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        <Pagination.Prev
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages).keys()].map((page) => (
          <Pagination.Item
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>

      {/* Modal for Order Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <h5>Order ID: {selectedOrder.orderId}</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>{selectedOrder.product.name}</td>
                    <td>{selectedOrder.quantity}</td>
                    <td>{`Rs. ${selectedOrder.totalPrice}`}</td>
                  </tr>
                </tbody>
              </Table>
              <Button
                style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
                onClick={() => downloadOrderDetailsPDF(selectedOrder)}
              >
                Download Order PDF
              </Button>
              {/* Show "Mark as Delivered" button only if the status is "Pending" */}
              {selectedOrder.status === 'Pending' && (
                <Button
                  style={{
                    backgroundColor: 'green',
                    borderColor: 'green',
                    marginLeft: '10px',
                  }}
                  onClick={() => setShowConfirmModal(true)} // Open confirmation modal
                >
                  Mark as Delivered
                </Button>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delivery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to mark this order as delivered?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleDelivered(selectedOrder)} // Mark as Delivered
          >
            Yes, Deliver
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Orders
