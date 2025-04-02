import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
    const [credentials, setCredentials] = useState({email: "", password: ""})
    let navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({email: credentials.email,password: credentials.password})
        });
        const json = await response.json()
        console.log(json);
        if(json.success){
            // redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Logged in  Successfully", "success")
            navigate("/");
        }
        else{
            props.showAlert("Invalid Details", "danger")
        }
    }
    const onChange =(e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }
  return (
    <div className='mt-3'  style={{marginLeft: "300px"}}>
        <h2>Login to continue to Noteify</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name = "email" aria-describedby="emailHelp"  style={{width:"700px"}}/>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
            <label htmlFor="Password" className="form-label">Password</label>
            <input type="password" className="form-control" value={credentials.password} onChange={onChange} id="Password" name="password"  style={{width:"700px"}}/>
        </div>
        <button type="submit" className="btn btn-primary" style={{color: "white",backgroundColor: " rgb(114, 58, 0)", borderRadius: "4px", width: "700px"}}>Submit</button>
        </form>
    </div>
  )
}

export default Login
