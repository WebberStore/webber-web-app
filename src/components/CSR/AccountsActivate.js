import React, { useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Card,
  Container,
  Row,
  Col,
  Badge,
} from 'react-bootstrap'

const AccountsActivate = () => {
  const [data, setData] = useState([
    { id: 1, name: 'Kamal Perera', email: 'kmal@gmail.com', status: 'Active' },
    {
      id: 2,
      name: 'Nilantha Bandara',
      email: 'nile@gmail.com',
      status: 'Deactivate',
    },
    {
      id: 3,
      name: 'Kasun Bandara',
      email: 'kasun@gmail.com',
      status: 'Pending',
    },
  ])

  const [selectedUser, setSelectedUser] = useState(null)
  const [confirmAction, setConfirmAction] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Handle the confirmation
  const handleStatusChange = (status) => {
    setConfirmAction(() => () => {
      setData((prevData) =>
        prevData.map((user) =>
          user.id === selectedUser.id ? { ...user, status } : user
        )
      )
      setSelectedUser(null) // Close modal after action
    })
    setShowConfirmation(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'success'
      case 'Deactivate':
        return 'secondary'
      case 'Pending':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction()
      setShowConfirmation(false) // Close confirmation modal
    }
  }

  const handleCancel = () => {
    setShowConfirmation(false) // Close confirmation modal
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
                <Card.Title>Active Customers</Card.Title>
                <Card.Text className="h2">125</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i
                  className="bi bi-hourglass-split"
                  style={{ fontSize: '2rem', color: 'orange' }}
                ></i>
              </div>
              <div>
                <Card.Title>Pending Customers</Card.Title>
                <Card.Text className="h2">125</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i
                  className="bi bi-person-x-fill"
                  style={{ fontSize: '2rem', color: 'red' }}
                ></i>
              </div>
              <div>
                <Card.Title>Deactivated Customers</Card.Title>
                <Card.Text className="h2">125</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
          {data.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>Customer</td>
              <td>
                <Badge bg={getStatusBadge(user.status)}>{user.status}</Badge>
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
            <div className="d-flex justify-content-around">
              <Button
                variant="success"
                onClick={() => handleStatusChange('Active')}
              >
                Activate
              </Button>
              <Button
                variant="danger"
                onClick={() => handleStatusChange('Deactivate')}
              >
                Deactivate
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {/* Custom Confirmation Modal */}
      <Modal show={showConfirmation} onHide={handleCancel}>
        <Modal.Body>
          <p>Are you sure you want to proceed with this action?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleConfirm}>
            Confirm
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default AccountsActivate
