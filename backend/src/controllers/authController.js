import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { generateToken } from '../utils/generateToken.js';
import logger from '../utils/logger.js';

// On Render both the API and the static site live under *.onrender.com (same
// site), so SameSite=Lax works for the cross-origin API calls. If you ever host
// the frontend on a different domain, set COOKIE_SAMESITE=none (and keep HTTPS).
const SAME_SITE = process.env.COOKIE_SAMESITE || 'lax';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: SAME_SITE,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

function sendAuthCookie(res, user) {
  const token = generateToken(user);
  res.cookie('token', token, COOKIE_OPTS);
  return token;
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findByEmail(String(email).toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is disabled. Contact support.' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    await User.touchLastLogin(user.id);
    const token = sendAuthCookie(res, user);
    logger.info(`Login: ${user.email}`);

    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role_name,
        store_id: user.store_id,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/logout
export function logout(_req, res) {
  res.clearCookie('token', { httpOnly: true, sameSite: SAME_SITE, secure: process.env.NODE_ENV === 'production', path: '/' });
  res.json({ message: 'Logged out successfully' });
}

// GET /api/auth/me
export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role_name,
        role_id: user.role_id,
        store_id: user.store_id,
        last_login: user.last_login,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/forgot-password  (mock)
export async function forgotPassword(req, res) {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: 'Email is required' });
  logger.info(`[mock] Password reset requested for ${email}`);
  res.json({
    message: 'If that email exists, a reset link has been sent (mock — no email actually sent).',
  });
}

// POST /api/auth/reset-password  (mock)
export async function resetPassword(req, res) {
  const { token, password } = req.body || {};
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }
  logger.info('[mock] Password reset completed (no DB write in demo)');
  res.json({ message: 'Password reset successfully (mock)' });
}