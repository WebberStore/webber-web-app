import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import IndexRoutes from './routes'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <IndexRoutes />
      </BrowserRouter>
    </div>
  )
}

export default App
