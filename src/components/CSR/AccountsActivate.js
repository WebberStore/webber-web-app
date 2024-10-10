import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Modal,
  Card,
  Container,
  Row,
  Col,
  Badge,
  Tabs,
  Tab,
} from 'react-bootstrap'
import axios from 'axios'

const AccountsActivate = () => {
  const [data, setData] = useState([])
  const [activeTab, setActiveTab] = useState('All')
  const [selectedUser, setSelectedUser] = useState(null)
  const [confirmAction, setConfirmAction] = useState(null) // To store the action for confirmation
  const [showConfirmation, setShowConfirmation] = useState(false) // Show confirmation inside modal

  // Fetch users with the role of Customer from the API
  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5034/api/user')
      const customers = response.data.filter((user) => user.role === 'Customer')
      setData(customers)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  // Handle the status change (approveStatus)
  const handleStatusChange = async () => {
    if (selectedUser) {
      const updatedUser = {
        ...selectedUser,
        approveStatus: confirmAction, // Update the approveStatus based on the action
      }

      try {
        // Send the full updated user data as the request payload
        await axios.put(
          `http://localhost:5034/api/user/${selectedUser.id}`,
          updatedUser
        )

        // Refresh the data after updating the status
        getUsers()
        setShowConfirmation(false)
        setSelectedUser(null) // Close modal after action
      } catch (error) {
        console.error('Error updating user status:', error)
      }
    }
  }

  const getStatusBadge = (status) => {
    return status ? 'success' : 'danger' // Green for Active, Red for Deactivated
  }

  // Filter users based on the selected tab
  const filteredData = data.filter((user) => {
    if (activeTab === 'All') return true
    if (activeTab === 'Active') return user.approveStatus === true
    if (activeTab === 'Deactivate') return user.approveStatus === false
    return true
  })

  // Function to show confirmation message before status change
  const showConfirmationMessage = (approveStatus) => {
    setConfirmAction(approveStatus) // Store the action (activate or deactivate)
    setShowConfirmation(true) // Show the confirmation message in the modal
  }

  return (
    <Container>
      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i
                  className="bi bi-people-fill"
                  style={{ fontSize: '2rem', color: 'blue' }}
                ></i>
              </div>
              <div>
                <Card.Title>Total Customers</Card.Title>
                <Card.Text className="h2">{data.length}</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i
                  className="bi bi-check-circle-fill"
                  style={{ fontSize: '2rem', color: 'green' }}
                ></i>
              </div>
              <div>
                <Card.Title>Active Customers</Card.Title>
                <Card.Text className="h2">
                  {data.filter((user) => user.approveStatus === true).length}
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i
                  className="bi bi-x-circle-fill"
                  style={{ fontSize: '2rem', color: 'red' }}
                ></i>
              </div>
              <div>
                <Card.Title>Deactivated Customers</Card.Title>
                <Card.Text className="h2">
                  {data.filter((user) => user.approveStatus === false).length}
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs for All, Active, and Deactivate */}
      <Tabs
        id="controlled-tab-example"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="All" title="All" />
        <Tab eventKey="Active" title="Active" />
        <Tab eventKey="Deactivate" title="Deactivate" />
      </Tabs>

      {/* Data Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((user, index) => (
            <tr key={user.id}>
              <td>{index}</td> {/* Custom No starting from 0 */}
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>Customer</td>
              <td>
                <Badge bg={getStatusBadge(user.approveStatus)}>
                  {user.approveStatus ? 'Active' : 'Deactivate'}
                </Badge>
              </td>
              <td>
                <Button variant="primary" onClick={() => setSelectedUser(user)}>
                  Action
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      {selectedUser && (
        <Modal show={true} onHide={() => setSelectedUser(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Change Status for {selectedUser.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {showConfirmation ? (
              <div>
                <p>
                  Are you sure you want to{' '}
                  {confirmAction ? 'activate' : 'deactivate'} this account?
                </p>
                <div className="d-flex justify-content-around">
                  <Button variant="success" onClick={handleStatusChange}>
                    Confirm
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-around">
                <Button
                  variant="success"
                  onClick={() => showConfirmationMessage(true)} // Show confirmation for activation
                  disabled={selectedUser.approveStatus === true} // Disable if already active
                >
                  Activate
                </Button>
                <Button
                  variant="danger"
                  onClick={() => showConfirmationMessage(false)} // Show confirmation for deactivation
                  disabled={selectedUser.approveStatus === false} // Disable if already deactivated
                >
                  Deactivate
                </Button>
              </div>
            )}
          </Modal.Body>
        </Modal>
      )}
    </Container>
  )
}

export default AccountsActivate
