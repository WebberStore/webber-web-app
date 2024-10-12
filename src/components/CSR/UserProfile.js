import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  })
  // state for the confirmation modal----------------------------------------------------------------
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  // loading state for fetching profile data----------------------------------------------------------------
  const [loading, setLoading] = useState(true)

  // api endpoints----------------------------------------------------------------
  const API_URL = process.env.REACT_APP_API_URL
  const userId = localStorage.getItem('csrid')

  // fetch user profile data on component load----------------------------------------------------------------
  useEffect(() => {
    fetch(`${API_URL}/api/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setProfile({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        })
        setLoading(false)
      })
      .catch((error) => console.error('Error fetching profile:', error))
  }, [API_URL, userId])

  // handle form input changes----------------------------------------------------------------
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })
  }

  // handle update confirmation----------------------------------------------------------------
  const handleUpdate = () => {
    setShowConfirmModal(true)
  }

  // confirm update and send update request----------------------------------------------------------------
  const confirmUpdate = () => {
    setShowConfirmModal(false)
    // update the user profile----------------------------------------------------------------
    fetch(`${API_URL}/api/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    })
      .then((response) => {
        if (response.ok) {
          alert('Profile updated successfully')
        } else {
          alert('Error updating profile')
        }
      })
      .catch((error) => console.error('Error updating profile:', error))
  }

  return (
    <div className="container mt-4">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="card">
          <div className="card-header bg-white">
            <h4 className="text-black">Edit Profile</h4>
          </div>
          <div className="card-body">
            <form>
              <div className="row">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={profile.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={profile.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={profile.password}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Role</label>
                      <input
                        type="text"
                        name="role"
                        className="form-control"
                        value={profile.role}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#6362b5', borderColor: '#6362b5' }}
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------confirmation modal-------------------------------------------------------------- */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to update your profile?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmUpdate}>
            Yes, Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default UserProfile
