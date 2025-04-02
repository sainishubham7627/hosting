import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: ""
    });

    const [emailSent, setEmailSent] = useState(false); // Track if verification email is sent
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, cpassword } = credentials;

        // Password confirmation check
        if (password !== cpassword) {
            props.showAlert("Passwords do not match", "danger");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/createuser", { // Update port to 5000
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            // Handle the JSON response
            const json = await response.json();

            console.log(json);

            if (json.success) {
                setEmailSent(true); // Show verification message
                props.showAlert("Verification email sent. Please check your inbox.", "success");

                // Optional: Redirect to a verification page
                navigate("/verify-email-notice");
            } else {
                props.showAlert(json.error || "Invalid Credentials", "danger");
            }
        } catch (error) {
            console.error("Error:", error.message);
            props.showAlert("Server error occurred", "danger");
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center flex-column mt-3">
            <h2>Signup to Notify</h2>

            {emailSent ? ( // Show message when email is sent
                <div className="alert alert-success">
                    <p>Verification email sent! Please check your inbox and verify your email.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "700px" }}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={credentials.name}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={onChange}
                            minLength={5}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="cpassword"
                            name="cpassword"
                            value={credentials.cpassword}
                            onChange={onChange}
                            minLength={5}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        style={{ backgroundColor: "rgb(94, 63, 45)", borderRadius: "4px" }}
                    >
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
};

export default Signup;
