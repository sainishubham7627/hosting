
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VerifyEmail = () => {
    const { token } = useParams(); // Get token from URL
    const [message, setMessage] = useState("Verifying...");

    useEffect(() => {
        const verifyEmail = async () => {
            const response = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`);
            const json = await response.json();

            if (json.success) {
                setMessage("Email verified successfully! You can now log in.");
            } else {
                setMessage(json.error || "Invalid or expired verification link.");
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div>
            <h2>Email Verification</h2>
            <p>{message}</p>
        </div>
    );
};

export default VerifyEmail;
