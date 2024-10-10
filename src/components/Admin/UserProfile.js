// UserProfile.js
import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const UserProfile = () => {
  const [profile, setProfile] = useState({
    firstName: 'Charlene',
    lastName: 'Reed',
    email: 'charlenereed@gmail.com',
    password: '*********',
    dob: '1990-01-25',
    phone: 'Malabe',
    address: 'Colombo',
    postalCode: '45962',
    city: 'Malabe',
    country: 'Sri Lanka',
  })

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })
  }

  const handleUpdate = () => {
    alert('Profile updated')
    // Add update logic
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-white">
          <h4 className="text-black">Edit Profile</h4>
        </div>
        <div className="card-body">
          <form>
            <div className="row">
              {/* Profile Image */}
              <div className="col-md-3 text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Profile"
                  className="rounded-circle img-fluid mb-3"
                  width="150"
                  height="150"
                />
                <input type="file" className="form-control" />
              </div>
              {/* Form Fields */}
              <div className="col-md-9">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={profile.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={profile.lastName}
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
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      className="form-control"
                      value={profile.dob}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Phone No</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={profile.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Permanent Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      value={profile.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      className="form-control"
                      value={profile.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={profile.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      className="form-control"
                      value={profile.country}
                      onChange={handleChange}
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
    </div>
  )
}

export default UserProfile
