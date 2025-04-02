import React from 'react'
import Image1 from './Screenshot 2025-01-23 114854.png'

const About = () => {
  return (
    <div>
      <h2>NOTEIFY</h2>
      <img src = {Image1} style={{width: "80vw"}}></img>
      <br>
      </br>
      <h4> This project, NOTIFY, is a website (not an app) that allows users to sign up and sign in, with their data being stored in MongoDB Atlas. <br></br>

🔹 Key Features: <br></br>
<i>✅ User Authentication – Users can create accounts and log in securely. <br></br>
✅ MongoDB Atlas Integration – User data is stored in the cloud database. <br></br>
✅ Express.js Backend – Handles API requests for authentication and user management. <br></br>
✅ React Frontend – Provides a user-friendly interface. <br></br>
✅ Port Change – The backend now runs on port 3000 instead of 3000. <br></br> </i></h4>
    </div>
    
  )
}

export default About
