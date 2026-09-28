// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, code: "AUTH_REQUIRED", message: "Please sign in to continue." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };  // Important: directly add user ID
    next();
  } catch (err) {
    res.status(401).json({ success: false, code: "AUTH_INVALID", message: "Your session has expired. Please sign in again." });
  }
};

module.exports = verifyUser;
