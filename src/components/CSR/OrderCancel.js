import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Pagination, Form, Alert } from 'react-bootstrap'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const OrderCancel = () => {
  const [orders, setOrders] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  // confirmation message------------------------------------------------------------------
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  // storing cancel reason----------------------------------------------------------------
  const [cancelReason, setCancelReason] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  // API response messages----------------------------------------------------------------
  const [alertMessage, setAlertMessage] = useState('')
  const [alertVariant, setAlertVariant] = useState('info')
  // API response----------------------------------------------------------------
  const [showResponseModal, setShowResponseModal] = useState(false)
  // API response text----------------------------------------------------------------
  const [responseMessage, setResponseMessage] = useState('')

  // api endpoint----------------------------------------------------------------
  const API_URL = process.env.REACT_APP_API_URL

  useEffect(() => {
    // fetch cancel request orders from API----------------------------------------------------
    fetch(`${API_URL}/api/order/cancel/requests`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error))
  }, [])

  const handleViewClick = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
    // reset alert when opening a new modal----------------------------------------------------------------
    setAlertMessage('')
    // reset cancel reason when opening a new modal----------------------------------------------------------------
    setCancelReason('')
  }

  // filter orders----------------------------------------------------------------
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

  // pdf export fuction--------------------------------------------------------
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

  // handle order cancel action----------------------------------------------------------------
  const handleOrderCancel = () => {
    if (!cancelReason) {
      setAlertMessage('Please enter a reason for cancellation.')
      setAlertVariant('danger')
    } else {
      // show confirmation modal before canceling the order---------------------------------------------------
      setShowConfirmModal(true)
    }
  }

  const confirmOrderCancel = () => {
    // call the API to cancel the order with the entered reason----------------------------------------------------------------
    const cancelApiUrl = `${API_URL}/api/order/cancel/${
      selectedOrder.id
    }?cancelReason=${encodeURIComponent(cancelReason)}`

    fetch(cancelApiUrl, {
      method: 'PUT',
    })
      // capture API response----------------------------------------------------------------
      .then((response) => response.text())
      .then((data) => {
        // store the API ----------------------------------------------------------------
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
    <div className="container mt-4 bg-gray-100 h-screen flex justify-center items-center">
      <h4> ORDER CANCELLATION REQUESTS</h4>
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

      {/* ---------------------------------------------------pagination - showing 10 per page------------------------------------------- */}
      <Pagination className="justify-content-center">
        <Pagination.Prev />
        <Pagination.Item active>{1}</Pagination.Item>
        <Pagination.Item>{2}</Pagination.Item>
        <Pagination.Next />
      </Pagination>

      {/* -----------------------------------------modal for viewing detailed order--------------------------------------------------------+ */}
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
                <br></br>
                <strong style={{ color: 'red' }}>
                  Order Cancel Reason: {selectedOrder.cancelReason}
                </strong>
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
                    <td>Rs.{item.product.price}.00</td>
                    <td>{item.quantity}</td>
                    <td>{item.product.vendor.name}</td>
                    <td>{item.totalPrice}</td>
                    <td>{selectedOrder.customer.name}</td>
                    <td>{selectedOrder.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

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

      {/* Confirmation Modal for Cancel Order */}
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
            Yes, Cancel Order
          </Button>
        </Modal.Footer>
      </Modal>

      {/* API Response Modal */}
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
