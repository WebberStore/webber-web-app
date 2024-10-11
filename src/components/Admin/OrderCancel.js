import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Pagination, Form, Alert } from 'react-bootstrap'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import 'bootstrap/dist/css/bootstrap.min.css'

const OrderCancel = () => {
  const [orders, setOrders] = useState([])

  // state for handling modal visibility----------------------------------------------------------------
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const [searchTerm, setSearchTerm] = useState('')

  // states for handling API response and alerts----------------------------------------------------------------
  const [alertMessage, setAlertMessage] = useState('')
  const [alertVariant, setAlertVariant] = useState('info')
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')

  // API endpoints----------------------------------------------------------------
  const API_URL = process.env.REACT_APP_API_URL

  // retriew cancellation requests from API endpoints----------------------------------------------------------------
  useEffect(() => {
    fetch(`${API_URL}/api/order/cancel/requests`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error))
  }, [])

  // dandle view button click, open the modal, and reset states----------------------------------------------------------------
  const handleViewClick = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
    setAlertMessage('')
    setCancelReason('')
  }

  // filter orders based on the search term----------------------------------------------------------------
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase())
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.customer.name.toLowerCase().includes(searchTerm) ||
      order.orderItems
        .map((item) => item.product.name.toLowerCase())
        .join(', ')
        .includes(searchTerm)
  )

  // export as pdf fuction--------------------------------------------------------
  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Order Cancellation Report', 14, 16)

    const tableColumn = [
      'No',
      'Order Items',
      'Customer',
      'Order Price',
      'Reason',
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
        order.cancelReason,
        order.status,
      ]
      tableRows.push(orderData)
    })

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    })

    doc.save('orders-cancellation-report.pdf')
  }

  // handle order cancellation process by asking for a reason----------------
  const handleOrderCancel = () => {
    if (!cancelReason) {
      // if no reason is provided, show alert------------------------------------------------
      setAlertMessage('Please enter a reason for cancellation.')
      setAlertVariant('danger')
    } else {
      // ask a confirmation before cancellation------------------------------------------------
      setShowConfirmModal(true)
    }
  }

  // confirm the order cancellation and call the API with the cancel reason------------------------------------------------
  const confirmOrderCancel = () => {
    const cancelApiUrl = `${API_URL}/api/order/cancel/${
      selectedOrder.id
    }?cancelReason=${encodeURIComponent(cancelReason)}`

    fetch(cancelApiUrl, {
      method: 'PUT',
    })
      // capture the API response for user visibility-------------------------------------------
      .then((response) => response.text())
      .then((data) => {
        setResponseMessage(data)
        setAlertVariant('info')
        setShowResponseModal(true)
        setShowConfirmModal(false)
      })
      .catch((error) => {
        setResponseMessage('Error canceling the order.')
        setAlertVariant('danger')
        setShowResponseModal(true)
        setShowConfirmModal(false)
      })
  }

  return (
    <div className="container mt-4">
      <h4>Orders Cancellation Requests</h4>

      <div className="d-flex justify-content-between">
        <Form.Control
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

      {/* -------------------------------------orders table---------------------------------------------------------- */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>No</th>
            <th>Order Items</th>
            <th>Customer</th>
            <th>Order Price</th>
            <th>Reason</th>
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
              <td>{order.cancelReason}</td>
              <td>
                <Button
                  variant={
                    order.status === 'Pending'
                      ? 'secondary'
                      : order.status === 'Delivered'
                      ? 'success'
                      : order.status === 'Canceled'
                      ? 'danger'
                      : 'info'
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

      {/* ---------------------------------------------Pagination - showing 10 per page--------------------------------------------------------------- */}
      <Pagination className="justify-content-center">
        <Pagination.Prev />
        <Pagination.Item active>{1}</Pagination.Item>
        <Pagination.Item>{2}</Pagination.Item>
        <Pagination.Next />
      </Pagination>

      {/* ---------------------------------------------------modal for viewing detailed order details---------------------------------------------------------- */}
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
                <strong>Order ID:</strong> {selectedOrder.id}
                <br />
                <strong>Customer Name:</strong> {selectedOrder.customer.name}
                <br />
                <strong>Grand Total:</strong> Rs.{selectedOrder.orderPrice}.00
                <br />
                <strong>Order Status:</strong> {selectedOrder.status}
                <br />
                <strong style={{ color: 'red' }}>
                  Order Cancel Reason: {selectedOrder.cancelReason}
                </strong>
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
                    <td>Rs.{item.product.price}.00</td>
                    <td>{item.quantity}</td>
                    <td>{item.product.vendor.name}</td>
                    <td>Rs.{item.totalPrice}</td>
                    <td>{selectedOrder.customer.name}</td>
                    <td>{selectedOrder.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* -----------------------------------------------------------feild for cancellation reason------------------------------------- */}
            <Form.Group className="mt-3">
              <Form.Label>Cancel Note</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a note for cancellation"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button
              variant="danger"
              onClick={handleOrderCancel}
              className="me-2"
            >
              Cancel Order
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* -----------------------------------------------confirmation Modal for cancel order-------------------------------------------------- */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this order?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmOrderCancel}>
            Yes, Cancel Order.
          </Button>
        </Modal.Footer>
      </Modal>

      {/* -------------------------------------------------showing api response to the user--------------------------------------- */}
      <Modal
        show={showResponseModal}
        onHide={() => setShowResponseModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Response</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant={alertVariant}>{responseMessage}</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowResponseModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default OrderCancel
