import React, { useState } from 'react'
import {
  Table,
  Button,
  Tab,
  Tabs,
  Pagination,
  InputGroup,
  FormControl,
  Modal,
} from 'react-bootstrap'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import OrderDetails from './OrderDetails' // Import the order details component

const Orders = () => {
  const [key, setKey] = useState('newOrders') // Managing the active tab
  const [showModal, setShowModal] = useState(false) // State to manage modal visibility
  const [selectedOrder, setSelectedOrder] = useState(null) // Store selected order
  const [searchTerm, setSearchTerm] = useState('') // State for search functionality
  const [currentPage, setCurrentPage] = useState(1) // Pagination state

  const orders = [
    {
      id: 1,
      product: 'Men T-shirt Black',
      quantity: 15,
      category: 'Mens',
      customer: 'Kamal',
      total: 1540,
      status: 'Pending',
    },
    {
      id: 2,
      product: 'Men T-shirt Blue',
      quantity: 10,
      category: 'Mens',
      customer: 'Silva',
      total: 1540,
      status: 'Pending',
    },
    {
      id: 3,
      product: 'Cap Red',
      quantity: 5,
      category: 'Accessories',
      customer: 'Shani',
      total: 2100,
      status: 'Accepted',
    },
    {
      id: 4,
      product: 'Women Denim',
      quantity: 4,
      category: 'Women',
      customer: 'Kamal',
      total: 5400,
      status: 'Accepted',
    },
    {
      id: 5,
      product: 'Women Shirt',
      quantity: 11,
      category: 'Women',
      customer: 'Kamal',
      total: 2400,
      status: 'Rejected',
    },
    // Add more data here
  ]

  // Filter orders based on tab and search term
  const filteredOrders = orders
    .filter((order) => {
      if (key === 'newOrders' && order.status === 'Pending') return true
      if (key === 'acceptOrders' && order.status === 'Accepted') return true
      if (key === 'rejectOrders' && order.status === 'Rejected') return true
      return false
    })
    .filter((order) => {
      return (
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

  // Pagination setup
  const ordersPerPage = 10
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

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Orders Report', 14, 10)
    doc.autoTable({
      startY: 20,
      head: [
        [
          'No',
          'Product',
          'Quantity',
          'Category',
          'Customer',
          'Total Amount',
          'Status',
        ],
      ],
      body: filteredOrders.map((order, index) => [
        index + 1,
        order.product,
        order.quantity,
        order.category,
        order.customer,
        `Rs. ${order.total}`,
        order.status,
      ]),
    })
    doc.save('orders_report.pdf')
  }

  return (
    <div className="container mt-4">
      <h3>Orders</h3>

      {/* Tabs for toggling between orders */}
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="newOrders" title="New Orders" />
        <Tab eventKey="acceptOrders" title="Accept Orders" />
        <Tab eventKey="rejectOrders" title="Reject Orders" />
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
            <th>Category</th>
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
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td>{order.category}</td>
              <td>{order.customer}</td>
              <td>{`Rs. ${order.total}`}</td>
              <td>
                <Button
                  variant={
                    order.status === 'Pending'
                      ? 'secondary'
                      : order.status === 'Accepted'
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
          <OrderDetails order={selectedOrder} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Orders
