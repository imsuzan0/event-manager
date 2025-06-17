import jwt from 'jsonwebtoken';

export const protectRoute = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = { id: decoded.userId ,name: decoded.name}; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed', error });
  }
};