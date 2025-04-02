import React, { useEffect } from 'react';

const EmailVerificationPage = () => {
    useEffect(() => {
        // Extract status and message from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const message = urlParams.get('message');

        // Display the alert based on the status
        if (status === 'success') {
            alert(message); // Show success message
        } else if (status === 'error') {
            alert(message); // Show error message
        }
    }, []); // Empty dependency array ensures it runs once when the component mounts

    return (
        <div>
            <h1>Email Verification</h1>
            {/* Display your page content here */}
            <p>Follow the instructions to verify your email address.</p>
        </div>
    );
};

export default EmailVerificationPage;
