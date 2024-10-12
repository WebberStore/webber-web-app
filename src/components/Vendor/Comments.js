import React, { useState, useEffect } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Comments() {
  const [comments, setComments] = useState([])

  const API_URL = process.env.REACT_APP_API_URL
  const userId = localStorage.getItem('vendorid')

  // retriew all cutomer details----------------------------------------------------------------
  useEffect(() => {
    getComments()
  }, [])

  const getComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/rating/vendor/${userId}`)
      setComments(response.data)
    } catch (error) {
      console.error('Error fetching Comments:', error)
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Comments</h3>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>No</th>
            <th>Comment</th>
            <th>Rating</th>
            <th>Customer Name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comments, index) => (
            <tr key={comments.id}>
              <td>{index + 1}</td>
              <td>{comments.comment}</td>
              <td>{comments.rating}</td>
              <td>{comments.customer.name}</td>
              <td>{new Date(comments.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
