import React from 'react'
import { createRoot } from 'react-dom/client'

function SimpleTest() {
  console.log('SimpleTest component is rendering...')
  return (
    <div style={{
      padding: '50px',
      backgroundColor: '#ff0000',
      color: 'white',
      fontSize: '30px',
      textAlign: 'center'
    }}>
      <h1>REACT IS WORKING!</h1>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<SimpleTest />)