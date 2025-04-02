const jwt = require("jsonwebtoken");

const fetchuser = (req, res, next) => {
    // Get the user from the JWT token (from the 'auth-token' header)
    const token = req.header("auth-token");
    
    // If no token is provided, return an error
    if (!token) {
        return res.status(401).send({ error: "Access Denied!" });
    }
    
    try {
        // Verify the token using JWT_SECRET from environment variables
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user; // Attach user data to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).send({ error: "Invalid Token" });
    }
};

module.exports = fetchuser;
