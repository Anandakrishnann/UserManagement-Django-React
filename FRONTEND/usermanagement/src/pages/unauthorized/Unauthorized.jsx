import React from 'react'
import "./unauthorized.css"
import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {

  const navigate = useNavigate()

  const goback = () => {
    navigate('/login')
  }

  return (
    <div className="unauthorized-container">
        <h1 className="unauthorized-title">Unauthorized</h1>
        <p className="unauthorized-message">You do not have access to this page.</p>
        <button onClick={goback} className="unauthorized-goback">Go Back</button>
    </div>
  )
}

export default Unauthorized
