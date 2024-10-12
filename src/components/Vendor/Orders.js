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
  Form,
} from 'react-bootstrap'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const Orders = () => {
  const [key, setKey] = useState('newOrders')
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [orders, setOrders] = useState([])
  const [newStatus, setNewStatus] = useState('')
  const [actionType, setActionType] = useState('')

  const ordersPerPage = 10
  const API_URL = process.env.REACT_APP_API_URL
  const vendorId = localStorage.getItem('vendorid')

  // retriew all orders from API----------------------------------------------------------
  useEffect(() => {
    fetch(`${API_URL}/api/order/item/vendor/${vendorId}`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.log(error))
  }, [])

  // filter orders----------------------------------------------------------------
  const filteredOrders = orders
    .filter((order) => {
      if (key === 'newOrders' && order.status === 'Pending') return true
      if (key === 'dispatchedOrders' && order.status === 'Dispatched')
        return true
      if (key === 'deliveredOrders' && order.status === 'Delivered') return true
      return false
    })
    .filter((order) => {
      return (
        order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

  // pagination setup----------------------------------------------------------------
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  )
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowModal(true)

    // set the status dropdown to the next possible status--------------------------------------------------------
    if (order.status === 'Pending') {
      setNewStatus('Dispatched') // allow changing from pending to dispatched----------------------------------------------------------------
    } else if (order.status === 'Dispatched') {
      setNewStatus('Delivered') // allow changing from dispatched to delivered----------------------------------------------------------------
    }
  }

  // update the order status after confirmation----------------------------------------------------------------
  const handleUpdateStatus = () => {
    fetch(
      `${API_URL}/api/order/item/status/${selectedOrder.id}?status=${newStatus}`,
      {
        method: 'PUT',
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const updatedOrders = orders.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        )
        setOrders(updatedOrders)
        setShowModal(false)
        setShowConfirmModal(false)
      })
      .catch((error) => console.log(error))
  }

  // confirmation logic for status update-------------------------------------------------
  const handleStatusChange = () => {
    if (newStatus === 'Dispatched') {
      setConfirmationMessage(
        'Are you sure you want to mark this order as Dispatched?'
      )
      setActionType('Dispatched')
    } else if (newStatus === 'Delivered') {
      setConfirmationMessage(
        'Are you sure you want to mark this order as Delivered?'
      )
      setActionType('Delivered')
    }
    setShowConfirmModal(true)
  }

  // download PDF function for main data table----------------------------------------------------------------
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

  // download PDF for the modal - Order details--------------------------------
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

      {/* ----------------------------------------------------------tabs for toggling between orders------------------------------------------------------------------ */}
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="newOrders" title="New Orders" />
        <Tab eventKey="dispatchedOrders" title="Dispatched Orders" />
        <Tab eventKey="deliveredOrders" title="Delivered Orders" />
      </Tabs>

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

      {/* ---------------------------------------------------------datatable-------------------------------------------------------------- */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>Image</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order, index) => (
            <tr key={order.id}>
              <td>{indexOfFirstOrder + index + 1}</td>
              <td>
                <img
                  src={order.product.imageUrl}
                  alt={order.product.name}
                  className="rounded-circle"
                  style={{ width: '50px', height: '50px' }}
                />
              </td>
              <td>{order.product.name}</td>
              <td>{order.quantity}</td>
              <td>{order.customer.name}</td>
              <td>{`Rs. ${order.totalPrice}`}.00</td>
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

      {/* ----------------------------------------------------------pagination------------------------------------------------------------- */}
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

      {/* -------------------------------------------------------------------------modal for order details--------------------------------------------------------- */}
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
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <img
                        src={selectedOrder.product.imageUrl}
                        alt={selectedOrder.product.name}
                        className="rounded-circle"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </td>
                    <td>{selectedOrder.product.name}</td>
                    <td>{selectedOrder.quantity}</td>
                    <td>{`Rs. ${selectedOrder.totalPrice}`}.00</td>
                  </tr>
                </tbody>
              </Table>
              <Button
                style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
                onClick={() => downloadOrderDetailsPDF(selectedOrder)}
              >
                Download Order PDF
              </Button>

              {/* -----------------------------------------status dropdown logic--------------------------------------------- */}
              {key !== 'deliveredOrders' && (
                <Form.Group className="mt-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {/* -------------------------------in new orders tab, show Dispatched only------------------------------- */}
                    {key === 'newOrders' && (
                      <option value="Dispatched">Dispatched</option>
                    )}
                    {/* -------------------------------------in dispatched orders tab, show Delivered only------------------------------- */}
                    {key === 'dispatchedOrders' && (
                      <option value="Delivered">Delivered</option>
                    )}
                  </Form.Control>
                </Form.Group>
              )}

              {/* ----------------------------------show the update button only if not in delivered orders-------------------------------- */}
              {key !== 'deliveredOrders' && (
                <Button
                  style={{
                    backgroundColor: 'green',
                    borderColor: 'green',
                    marginTop: '10px',
                  }}
                  onClick={handleStatusChange}
                >
                  Update Status
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

      {/* ---------------------------------------------------------confirmation Modal for status change----------------------------------------- */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm {actionType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmationMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Yes, Update to {actionType}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Orders
