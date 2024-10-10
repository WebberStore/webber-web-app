import React, { useState } from 'react'
import { Table, Button, Modal, Pagination, Form, Alert } from 'react-bootstrap'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Dummy data
const initialOrders = [
  {
    id: 1,
    product: 'Men T-shirt Black',
    quantity: 15,
    category: 'Mens',
    customer: 'Kamal',
    amount: 'Rs. 1540',
    status: 'Pending',
  },
  {
    id: 2,
    product: 'Men T-shirt Blue',
    quantity: 10,
    category: 'Mens',
    customer: 'Silva',
    amount: 'Rs. 1540',
    status: 'Pending',
  },
  // More rows here...
]

const Order = () => {
  const [orders, setOrders] = useState(initialOrders)
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [cancelNote, setCancelNote] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmingCancel, setConfirmingCancel] = useState(false) // New state for confirming cancellation
  const [searchTerm, setSearchTerm] = useState('')

  // Handle modal actions
  const handleViewClick = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
    setShowConfirmation(false)
    setCancelNote('')
    setConfirmingCancel(false) // Reset confirmation state
  }

  const handleCancelOrder = () => {
    if (!cancelNote) {
      setShowConfirmation(true)
    } else {
      setConfirmingCancel(true) // Ask for confirmation before canceling
    }
  }

  const confirmCancelOrder = () => {
    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id
        ? { ...order, status: 'Cancelled', cancelNote }
        : order
    )
    setOrders(updatedOrders)
    setShowModal(false)
    setCancelNote('')
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase())
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.product.toLowerCase().includes(searchTerm) ||
      order.customer.toLowerCase().includes(searchTerm)
  )

  const downloadPDF = () => {
    const doc = new jsPDF()

    // Add title
    doc.text('Order Report', 14, 16)

    // Prepare table data for pdf-autotable
    const tableColumn = [
      'No',
      'Product',
      'Quantity',
      'Category',
      'Customer',
      'Total Amount',
      'Status',
    ]
    const tableRows = []

    filteredOrders.forEach((order, index) => {
      const orderData = [
        index + 1,
        order.product,
        order.quantity,
        order.category,
        order.customer,
        order.amount,
        order.status,
      ]
      tableRows.push(orderData)
    })

    // Generate the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    })

    // Save the PDF
    doc.save('orders-report.pdf')
  }

  return (
    <div className="container mt-5 bg-gray-100 h-screen w-screen flex justify-center items-center">
      <h4>Orders</h4>
      <div className="d-flex justify-content-between">
        <input
          type="text"
          placeholder="Search orders..."
          className="form-control w-25"
          onChange={handleSearch}
        />
        <Button
          variant="primary"
          style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
          onClick={downloadPDF} // Call the downloadPDF function here
        >
          Download PDF
        </Button>
      </div>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>No</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Customer</th>
            <th>Vendor</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td>{order.category}</td>
              <td>{order.customer}</td>
              <td>{order.customer}</td>
              <td>{order.amount}</td>
              <td>
                <Button
                  variant={
                    order.status === 'Pending'
                      ? 'secondary'
                      : order.status === 'Accepted'
                      ? 'success'
                      : order.status === 'Rejected'
                      ? 'danger'
                      : order.status === 'Delivered'
                      ? 'info'
                      : 'warning'
                  }
                  size="sm"
                >
                  {order.status}
                </Button>
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewClick(order)}
                  style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination (Assuming showing 10 per page) */}
      <Pagination className="justify-content-center">
        <Pagination.Prev />
        <Pagination.Item active>{1}</Pagination.Item>
        <Pagination.Item>{2}</Pagination.Item>
        <Pagination.Next />
      </Pagination>

      {/* Modal for viewing order and canceling */}
      {selectedOrder && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Product: {selectedOrder.product}</p>
            <p>Quantity: {selectedOrder.quantity}</p>
            <p>Total Amount: {selectedOrder.amount}</p>
            <Form.Group controlId="cancelNote">
              <Form.Label>Cancel Note</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a note for cancellation"
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
              />
            </Form.Group>

            {/* Show confirmation message if no note is provided */}
            {showConfirmation && (
              <Alert variant="danger" className="mt-3">
                Please enter a note before cancelling the order.
              </Alert>
            )}

            {/* Confirmation step before canceling */}
            {confirmingCancel && (
              <Alert variant="warning" className="mt-3">
                Are you sure you want to cancel this order?
                <div className="mt-2">
                  <Button
                    variant="danger"
                    onClick={confirmCancelOrder}
                    className="me-2"
                  >
                    Yes, Cancel
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setConfirmingCancel(false)}
                    className="ml-2"
                  >
                    No
                  </Button>
                </div>
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelOrder}
              disabled={confirmingCancel}
            >
              Cancel Order
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  )
}

export default Order
