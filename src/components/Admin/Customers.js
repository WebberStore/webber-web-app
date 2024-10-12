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

const Customers = () => {
  const [data, setData] = useState([])
  const [activeTab, setActiveTab] = useState('All')
  const [selectedUser, setSelectedUser] = useState(null)
  const [confirmAction, setConfirmAction] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // api endpoints-------------------------------------------
  const API_URL = process.env.REACT_APP_API_URL

  // fetch users with the role of customer from the API-------------------------------------
  useEffect(() => {
    getUsers()
  }, [])

  // retriew all cutomers----------------------------------------------------------
  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user`)
      const customers = response.data.filter((user) => user.role === 'Customer')
      setData(customers)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  // handle the status change----------------------------------------------------------------
  const handleStatusChange = async () => {
    if (selectedUser) {
      let updatedUser = { ...selectedUser }

      if (activeTab === 'UnApproved') {
        // update only the approveStatus for UnApproved tab----------------------------
        updatedUser.approveStatus = true
      } else {
        // update the status for other tabs-----------------------------------------------
        updatedUser.status = confirmAction
      }

      try {
        // send the full updated user data as the request payload----------------------------------------------------------------
        await axios.put(`${API_URL}/api/user/${selectedUser.id}`, updatedUser)

        // refresh the data after updating the status---------------------------------
        getUsers()
        setShowConfirmation(false)
        setSelectedUser(null)
        //alert('Account update successful!')
      } catch (error) {
        console.error('Error updating user status:', error)
      }
    }
  }

  // green for active, red for deactivated-------------------------------------------------------
  const getStatusBadge = (status) => {
    return status ? 'success' : 'danger'
  }

  // filter users based on the selected tab--------------------------------------------------
  const filteredData = data.filter((user) => {
    if (activeTab === 'All') return true
    if (activeTab === 'Active') return user.status === true
    if (activeTab === 'Deactivate') return user.status === false
    if (activeTab === 'UnApproved') return user.approveStatus === false
    return true
  })

  // function to show confirmation message before status change-----------------------------------------
  const showConfirmationMessage = (approveStatus) => {
    // store the action (activate or deactivate)-------------------------------------
    setConfirmAction(approveStatus)
    // show the confirmation message in the modal--------------------------------
    setShowConfirmation(true)
  }

  return (
    <Container>
      {/* -----------------------------------------------summary cards------------------------------------------------------- */}
      <Row className="mb-4">
        <Col md={3}>
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

        <Col md={3}>
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
                  {data.filter((user) => user.status === true).length}
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
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
                  {data.filter((user) => user.status === false).length}
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i
                  className="bi bi-x-circle-fill"
                  style={{ fontSize: '2rem', color: 'red' }}
                ></i>
              </div>
              <div>
                <Card.Title>Un Approved Customers</Card.Title>
                <Card.Text className="h2">
                  {data.filter((user) => user.approveStatus === false).length}
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* -------------------------------------tabs for All, Active, and Deactivate------------------------------------ */}
      <Tabs
        id="controlled-tab-example"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="All" title="All" />
        <Tab eventKey="Active" title="Active" />
        <Tab eventKey="Deactivate" title="Deactivate" />
        <Tab eventKey="UnApproved" title="Un Approved" />
      </Tabs>

      {/* ------------------------------------------datatable---------------------------------------- */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Account Status</th>
            <th>Approve Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((user, index) => (
            <tr key={user.id}>
              <td>{index}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>Customer</td>
              <td>
                <Badge bg={getStatusBadge(user.status)}>
                  {user.status ? 'Active' : 'Deactivate'}
                </Badge>
              </td>
              <td>
                <Badge bg={getStatusBadge(user.approveStatus)}>
                  {user.approveStatus ? 'Approved' : 'Not '}
                </Badge>
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedUser(user)
                    if (activeTab === 'UnApproved') {
                      showConfirmationMessage(true)
                    }
                  }}
                  size="sm"
                  style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
                >
                  Action
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ----------------------------------------------------modal---------------------------------------------------- */}
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
                  onClick={() => showConfirmationMessage(true)}
                  // disable if already deactivated-------------------------------------------------------------
                  disabled={selectedUser.status === true}
                >
                  Activate
                </Button>
                <Button
                  variant="danger"
                  onClick={() => showConfirmationMessage(false)}
                  // disable if already active----------------------------------------------------------------
                  disabled={selectedUser.status === false}
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

export default Customers
