import { useState, useEffect } from 'react'
import axios from 'axios'
import loginImg from '../../assets/login.png'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState('')
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const API_URL = process.env.REACT_APP_API_URL

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        `${API_URL}/api/user/login`,
        {
          username: user,
          password: pwd,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const { id, role } = response?.data

      // Store the user ID in local storage based on the role
      if (role === 'Vendor') {
        localStorage.setItem('vendorid', id)
        navigate('/vendor/notifications')
      } else if (role === 'Admin') {
        localStorage.setItem('adminid', id)
        navigate('/admin')
      } else if (role === 'CSR') {
        localStorage.setItem('csrid', id)
        navigate('/csr/order')
      }

      // Clear form fields after login
      setUser('')
      setPwd('')
    } catch (err) {
      if (!err?.response) {
        setErrMsg('Server Error')
      } else if (err.response?.status === 400) {
        setErrMsg('Username or password required')
      } else if (err.response?.status === 401) {
        setErrMsg('Invalid username or password')
      } else {
        setErrMsg('Login Failed')
      }
    }
  }

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <div className="row flex-grow-1 align-items-center justify-content-center">
        {/* Centered Illustration */}
        <div className="col-md-12 d-flex justify-content-center">
          <img src={loginImg} alt="Login Illustration" className="img-fluid" style={{ maxHeight: '400px' }} />
        </div>
      </div>

      {/* Full-width form at the bottom */}
      <div className="row mb-4">
        <div className="col-md-12">
          <form className="bg-re p-4 d-flex justify-content-center align-items-center" onSubmit={handleSubmit}>
            <div style={{ maxWidth: '600px', width: '100%' }}>
              {errMsg && (
                <p className="alert alert-danger text-center">{errMsg}</p>
              )}

              {/* Email Input */}
              <div className="form-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="user"
                  placeholder="Email"
                  autoComplete="email"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  style={{ borderRadius: '10px', padding: '10px' }}
                />
              </div>

              {/* Password Input */}
              <div className="form-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  style={{ borderRadius: '10px', padding: '10px' }}
                />
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="d-flex justify-content-between mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember Me
                  </label>
                </div>
                <a href="#" className="text-muted">
                  Forgot Password?
                </a>
              </div>

              {/* Sign In Button */}
              <button type="submit" className="btn btn-dark w-100 py-2" style={{ borderRadius: '10px' }}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
