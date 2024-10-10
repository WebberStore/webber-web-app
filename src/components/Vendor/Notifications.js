import React, { useState, useEffect } from 'react'
import { Table, Button, Tabs, Tab, Modal } from 'react-bootstrap'

const Notifications = () => {
  const [key, setKey] = useState('unseen') // Tab state
  const [notifications, setNotifications] = useState([]) // Store notifications
  const [selectedNotification, setSelectedNotification] = useState(null) // Store selected notification for modal
  const [showModal, setShowModal] = useState(false) // Modal state
  const [currentTabNotifications, setCurrentTabNotifications] = useState([]) // Notifications filtered by tab
  const [rating, setRating] = useState(null) // Store the user rating

  const API_URL = process.env.REACT_APP_API_URL
  const vendorId = '66fabea22165a016474e7a6e'

  // Fetch all notifications (both seen and unseen) on component load
  useEffect(() => {
    fetch(`${API_URL}/api/notification/user/${vendorId}`)
      .then((response) => response.json())
      .then((data) => {
        setNotifications(data) // Store all notifications
      })
      .catch((error) => console.error('Error fetching notifications:', error))
  }, [])

  // Fetch user rating when the component loads
  useEffect(() => {
    fetch(`${API_URL}/api/user/${vendorId}`)
      .then((response) => response.json())
      .then((data) => {
        setRating(data.rating) // Set the rating value
      })
      .catch((error) => console.error('Error fetching user rating:', error))
  }, [])

  // Filter notifications based on the selected tab (unseen or seen)
  useEffect(() => {
    const filtered = notifications.filter(
      (notification) => notification.seenStatus === (key === 'seen')
    )
    setCurrentTabNotifications(filtered)
  }, [key, notifications])

  // Handle viewing the notification and updating its seen status if it is in the unseen tab
  const handleViewNotification = (notification) => {
    setSelectedNotification(notification)
    setShowModal(true)

    // Only update the seen status if the notification is unseen
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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h3>Notifications</h3>

        {/* Display rating in a square box on the right */}
        {rating !== null && (
          <div className="rating-box">
            Rating - <strong>{rating}</strong>
          </div>
        )}
      </div>

      {/* Tabs for toggling between unseen and seen notifications */}
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="unseen" title="Unseen" />
        <Tab eventKey="seen" title="Seen" />
      </Tabs>

      {/* Data Table for displaying notifications */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentTabNotifications.map((notification, index) => (
            <tr key={notification.id}>
              <td>{index}</td>
              <td>{notification.title}</td>
              <td>{new Date(notification.createdAt).toLocaleDateString()}</td>
              <td>
                <Button
                  style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }} // Custom color
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

      {/* Modal for displaying notification details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNotification && (
            <>
              <h5>Title: {selectedNotification.title}</h5>
              <p>
                <strong>Body:</strong> {selectedNotification.body}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(selectedNotification.createdAt).toLocaleDateString()}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom CSS for rating box */}
      <style jsx>{`
        .rating-box {
          display: inline-block;
          padding: 10px;
          background-color: #6362b5;
          color: white;
          border-radius: 5px;
          font-size: 24px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

export default Notifications
