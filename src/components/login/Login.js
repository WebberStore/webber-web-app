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
      console.log(id) // Capture user id from response
      console.log(role) // Capture user role

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
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center rounded-lg">
      <div className="row w-100">
        {/* Left side with image */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img src={loginImg} alt="Login" className="img-fluid h-80 w-80" />
        </div>

        {/* Right side with login form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center rounded-lg">
          <form
            className="bg-dark p-5 rounded-lg"
            onSubmit={handleSubmit}
            style={{ maxWidth: '400px', width: '100%' }}
          >
            {errMsg && (
              <p className="alert alert-danger text-center">{errMsg}</p>
            )}
            <h2 className="text-center text-white mb-4">SIGN IN</h2>
            <h3 className="text-center text-white mb-4">
              Welcome To OrbitArcX
            </h3>

            {/* Email Input */}
            <div className="form-group mb-3">
              <label className="text-white">Email</label>
              <input
                type="email"
                className="form-control bg-secondary text-white"
                id="user"
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-group mb-3">
              <label className="text-white">Password</label>
              <input
                type="password"
                className="form-control bg-secondary text-white"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
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
                <label
                  className="form-check-label text-white"
                  htmlFor="rememberMe"
                >
                  Remember Me
                </label>
              </div>
              <a href="#" className="text-white">
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <button type="submit" className="btn btn-success w-100 py-2">
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
