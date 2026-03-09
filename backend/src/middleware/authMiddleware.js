import jwt from 'jsonwebtoken';

/**
 * Middleware to protect private routes.
 *
 * Verifies the JWT token sent in the `Authorization: Bearer <token>` header.
 * If valid, attaches the decoded user payload to `req.user` and calls `next()`.
 * Returns 401 if the token is missing or invalid.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export default protect;
