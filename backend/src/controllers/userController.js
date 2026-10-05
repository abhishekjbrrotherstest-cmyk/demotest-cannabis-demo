import User from '../models/userModel.js';
import logger from '../utils/logger.js';

// GET /api/admin/users
export async function listUsers(_req, res, next) {
  try {
    const users = await User.findAll();
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/users/:id/status
export async function updateUserStatus(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (req.user.id === user.id) {
      return res.status(400).json({ message: 'You cannot disable your own account' });
    }
    const { status } = req.body || {};
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    await User.updateStatus(user.id, status);
    logger.info(`User ${user.email} status set to ${status}`);
    res.json({ message: 'User status updated' });
  } catch (err) {
    next(err);
  }
}