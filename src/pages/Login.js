import { useState, useEffect } from 'react'
import axios from 'axios'
import loginImg from '../assets/login.jpg'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [user, setUser] = useState('')
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/auth/login',
        JSON.stringify({ user, pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      console.log(JSON.stringify(response?.data))

      const accessToken = response?.data?.accessToken
      const role = response?.data?.role
      console.log(role)
      setAuth({ user, pwd, role, accessToken })
      setUser('')
      setPwd('')
      navigate('/admin')
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
          <img src={loginImg} alt="Login" className="img-fluid h-100 w-100" />
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

            {/* Username Input */}
            <div className="form-group mb-3">
              <label className="text-white">Username</label>
              <input
                type="text"
                className="form-control bg-secondary text-white"
                id="username"
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
