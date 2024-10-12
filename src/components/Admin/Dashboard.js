import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tabs, Tab, Pagination } from 'react-bootstrap'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import 'bootstrap/dist/css/bootstrap.min.css'

const Dashboard = () => {
  const [orders, setOrders] = useState([])
  const [customersCount, setCustomersCount] = useState(0)
  const [vendorsCount, setVendorsCount] = useState(0)
  const [categoriesCount, setCategoriesCount] = useState(0)
  const [productsCount, setProductsCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [key, setKey] = useState('unseen')
  const [currentTabNotifications, setCurrentTabNotifications] = useState([])

  // API endpoints---------------------------------------------------------------------
  const API_URL = process.env.REACT_APP_API_URL
  const adminId = localStorage.getItem('adminid')

  // Retrieve all orders data----------------------------------------------------------------
  useEffect(() => {
    fetch(`${API_URL}/api/order`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error))
  }, [])

  // Fetch customer, vendor, category, and product counts----------------------------------------------------------------
  useEffect(() => {
    // Customers count-----------------------
    fetch(`${API_URL}/api/user/role/Customer`)
      .then((response) => response.json())
      .then((data) => setCustomersCount(data.length))
      .catch((error) => console.error('Error fetching customers:', error))

    // Vendors count------------------------
    fetch(`${API_URL}/api/user/role/Vendor`)
      .then((response) => response.json())
      .then((data) => setVendorsCount(data.length))
      .catch((error) => console.error('Error fetching vendors:', error))

    // Categories count------------------------
    fetch(`${API_URL}/api/products/category`)
      .then((response) => response.json())
      .then((data) => setCategoriesCount(data.length))
      .catch((error) => console.error('Error fetching categories:', error))

    // Products count------------------------
    fetch(`${API_URL}/api/products`)
      .then((response) => response.json())
      .then((data) => setProductsCount(data.length))
      .catch((error) => console.error('Error fetching products:', error))
  }, [])

  // Fetch notifications---------------------
  useEffect(() => {
    fetch(`${API_URL}/api/notification/user/${adminId}`)
      .then((response) => response.json())
      .then((data) => setNotifications(data))
      .catch((error) => console.error('Error fetching notifications:', error))
  }, [])

  // Filter notifications based on the selected tab------------------------------------------------
  useEffect(() => {
    const filtered = notifications.filter(
      (notification) => notification.seenStatus === (key === 'seen')
    )
    setCurrentTabNotifications(filtered)
  }, [key, notifications])

  // Summary calculations-------------------------------------
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

  // Handling View Notification button click----------------------------------------------------------------
  const handleViewNotification = (notification) => {
    setSelectedNotification(notification)
    setShowNotificationModal(true)

    // Only update the seen status if the notification is unseen--------------------------------
    if (!notification.seenStatus) {
      fetch(
        `${API_URL}/api/notification/seen/${notification.id}?seenStatus=true`,
        { method: 'PUT' }
      )
        .then((response) => response.json())
        .then((updatedNotification) => {
          const updatedNotifications = notifications.map((n) =>
            n.id === notification.id ? { ...n, seenStatus: true } : n
          )
          setNotifications(updatedNotifications)
        })
        .catch((error) => console.error('Error updating seen status:', error))
    }
  }

  return (
    <div className="container mt-2">
      {/* --------------------------------------Summary Cards-------------------------------------------------------- */}
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
        <div className="col-md-3 mt-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Products Count</h5>
              <p className="card-text">{productsCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mt-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Categories Count</h5>
              <p className="card-text">{categoriesCount}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mt-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Vendors Count</h5>
              <p className="card-text">{vendorsCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mt-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Customers Count</h5>
              <p className="card-text">{customersCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------Notifications Tabs------------------------------------------------------------ */}
      <h4>Notifications</h4>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="unseen" title="Unseen" />
        <Tab eventKey="seen" title="Seen" />
      </Tabs>

      {/* ------------------------------------------------------------Notifications Table------------------------------------------------------------ */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentTabNotifications
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort notifications by date-------------------------------
            .map((notification, index) => (
              <tr key={notification.id}>
                <td>{index + 1}</td>
                <td>{notification.title}</td>
                <td>{new Date(notification.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleViewNotification(notification)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      {/* Modal for Viewing Notification Details */}
      {selectedNotification && (
        <Modal
          show={showNotificationModal}
          onHide={() => setShowNotificationModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Notification Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>{selectedNotification.title}</h5>
            <p>{selectedNotification.body}</p>
            <small>
              {new Date(selectedNotification.createdAt).toLocaleString()}
            </small>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowNotificationModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  )
}

export default Dashboard
