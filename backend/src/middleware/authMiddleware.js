import { verifyToken } from '../utils/generateToken.js';
import User from '../models/userModel.js';

export async function protect(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user no longer exists' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is disabled' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}