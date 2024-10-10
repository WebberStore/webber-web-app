import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Pagination, Form, Alert } from 'react-bootstrap'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const Order = () => {
  const [orders, setOrders] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false) // For confirmation message
  const [searchTerm, setSearchTerm] = useState('')

  const API_URL = process.env.REACT_APP_API_URL

  useEffect(() => {
    // Fetch orders from API
    fetch(`${API_URL}/api/order`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error))
  }, [])

  // Handle view button click
  const handleViewClick = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase())
  }

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.customer.name.toLowerCase().includes(searchTerm) ||
      order.orderItems
        .map((item) => item.product.name.toLowerCase())
        .join(', ')
        .includes(searchTerm)
  )

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Order Report', 14, 16)

    const tableColumn = [
      'No',
      'Order Items',
      'Customer',
      'Order Price',
      'Status',
    ]
    const tableRows = []

    filteredOrders.forEach((order, index) => {
      const orderItems = order.orderItems
        .map((item) => item.product.name)
        .join(', ')
      const orderData = [
        index + 1,
        orderItems,
        order.customer.name,
        `Rs. ${order.orderPrice}`,
        order.status,
      ]
      tableRows.push(orderData)
    })

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    })

    doc.save('orders-report.pdf')
  }

  // Handle order delivery action
  const handleOrderDelivered = () => {
    // Show confirmation modal before marking the order as delivered
    setShowConfirmModal(true)
  }

  // Confirm order delivery
  const confirmOrderDelivered = () => {
    // Code for updating order to delivered would go here
    // alert('Order delivered successfully')
    setShowConfirmModal(false)
    setShowModal(false) // Close the main modal
  }

  return (
    <div className="container mt-4 bg-gray-100 h-screen flex justify-center items-center">
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
          onClick={downloadPDF}
        >
          Download PDF
        </Button>
      </div>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>No</th>
            <th>Order Items</th>
            <th>Customer</th>
            <th>Order Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td>
                {order.orderItems.map((item) => item.product.name).join(', ')}
              </td>
              <td>{order.customer.name}</td>
              <td>Rs.{order.orderPrice}.00</td>
              <td>
                <Button
                  variant={
                    order.status === 'Pending'
                      ? 'secondary'
                      : order.status === 'Delivered'
                      ? 'success'
                      : order.status === 'Canceled'
                      ? 'danger'
                      : order.status === 'Partial_Delivered'
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

      {/* Modal for viewing detailed order */}
      {selectedOrder && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              ORDER DETAILS
              <p style={{ fontSize: '16px', color: '#555', marginTop: '10px' }}>
                <strong>Order ID:</strong> {selectedOrder.id}&nbsp;&nbsp;
                <br></br>
                <strong>Customer Name:</strong> {selectedOrder.customer.name}
                <br></br>
                <strong>Grand Total:</strong> Rs.{selectedOrder.orderPrice}.00
                <br></br>
                <strong>Order Status:</strong> {selectedOrder.status}
                &nbsp;&nbsp;
              </p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Vendor Name</th>
                  <th>Total Price</th>
                  <th>Customer Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.orderItems.map((item, index) => (
                  <tr key={item.product.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="rounded-circle"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </td>
                    <td>{item.product.name}</td>
                    <td>{item.product.price}</td>
                    <td>{item.quantity}</td>
                    <td>{item.product.vendor.name}</td>
                    <td>Rs.{item.totalPrice}.00</td>
                    <td>{selectedOrder.customer.name}</td>
                    <td>{selectedOrder.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button
              variant="info"
              onClick={handleOrderDelivered}
              className="me-2"
            >
              Order Delivered
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Confirmation Modal for Order Delivered */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
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
          <Button variant="primary" onClick={confirmOrderDelivered}>
            Yes, Deliver Order
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Order
