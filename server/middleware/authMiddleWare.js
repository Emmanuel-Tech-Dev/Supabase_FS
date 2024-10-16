const jwt = require("jsonwebtoken");

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });

const authentication = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    } // Log the token being verified

    const user = await verifyToken(accessToken); // This line should execute after logging
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log the error for debugging
    res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

module.exports = authentication;
