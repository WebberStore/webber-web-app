import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Pagination, Form } from 'react-bootstrap'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const Order = () => {
  // state for holding orders and selected order for viewing-----------------------------------------
  const [orders, setOrders] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // API endpoints--------------------------------------------------
  const API_URL = process.env.REACT_APP_API_URL

  // retriew all orders-------------------------------------------
  useEffect(() => {
    fetch(`${API_URL}/api/order`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error))
  }, [])

  // handle view button click----------------------------------------
  const handleViewClick = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  // filter orders based on search term (by customer name or product names)--------------------------------------------
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

  // summary calculations for total, delivered, partially delivered, and canceled orders-------------------------------------------------
  const totalOrders = orders.length
  const deliveredOrders = orders.filter(
    (order) => order.status === 'Delivered'
  ).length
  const partialDeliveredOrders = orders.filter(
    (order) => order.status === 'Partial_Delivered'
  ).length
  const canceledOrders = orders.filter(
    (order) => order.status === 'Cancelled'
  ).length

  // export orders as PDF-------------------------------------------
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

  // show confirmation modal before marking order as delivered----------------------------------------------------------------
  const handleOrderDelivered = () => {
    setShowConfirmModal(true)
  }

  // confirm order delivery action----------------------------------------------------------------
  const confirmOrderDelivered = () => {
    // call the API to update the order status to 'Delivered'----------------------------------------------------------------
    fetch(`${API_URL}/api/order/status/${selectedOrder.id}?status=Delivered`, {
      method: 'PUT',
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedOrders = orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: 'Delivered' }
            : order
        )
        setOrders(updatedOrders)

        // show success message-----------------------------------------------
        setSuccessMessage('Order has been marked as delivered successfully!')

        // hide both the confirmation modal and the detailed order modal---------------------------------------------
        setShowConfirmModal(false)
        setShowModal(false)

        // hide the success message after 3 seconds------------------------------------
        setTimeout(() => {
          setSuccessMessage('')
        }, 3000)
      })
      .catch((error) => console.error('Error updating order status:', error))
  }

  return (
    <div className="container mt-4">
      {/* -----------------------------------------------------summary Cards for orders----------------------------------------------------------- */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Orders</h5>
              <p className="card-text">{totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Delivered Orders</h5>
              <p className="card-text">{deliveredOrders}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Partially Delivered Orders</h5>
              <p className="card-text">{partialDeliveredOrders}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Cancelled Orders</h5>
              <p className="card-text">{canceledOrders}</p>
            </div>
          </div>
        </div>
      </div>

      <h4>Orders</h4>
      {/*------------------------------------------------------------------search bar and download PDF button------------------------------------------------------------------------- */}
      <div className="d-flex justify-content-between mb-3">
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

      {/* --------------------------------------------------------orders table------------------------------------------------------------------------ */}
      <Table striped bordered hover>
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
                      : order.status === 'Cancelled'
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

      {/* -----------------------------------pagination -showing 10 per page---------------------------------------- */}
      <Pagination className="justify-content-center">
        <Pagination.Prev />
        <Pagination.Item active>{1}</Pagination.Item>
        <Pagination.Item>{2}</Pagination.Item>
        <Pagination.Next />
      </Pagination>

      {/* -------------------------------------------modal for viewing detailed order----------------------------------------------- */}
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
                <br />
                <strong>Customer Name:</strong> {selectedOrder.customer.name}
                <br />
                <strong>Grand Total:</strong> Rs.{selectedOrder.orderPrice}.00
                <br />
                <strong>Order Status:</strong> {selectedOrder.status}
              </p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* -------------------------------------detailed order items table------------------------------------ */}
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
                    <td>Rs.{item.product.price}</td>
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

      {/* ----------------------------------------confirmation Modal for order delivered---------------------------------------------- */}
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
