import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`);
        
        if (response.ok) {
          alert("Email verified successfully! Please log in.");
          navigate("/login");
        } else {
          alert("Verification failed or token expired.");
          navigate("/signup");
        }
      } catch (error) {
        console.error("Verification Error:", error);
        alert("Server error. Try again later.");
        navigate("/signup");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return <h2>Verifying your email...</h2>;
};

export default VerifyEmail;
