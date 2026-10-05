import Role from '../models/roleModel.js';

/**
 * requirePermission('stores.edit') — RBAC gate.
 * Loads the requesting user's permission names and checks membership.
 */
export function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      const permissions = await Role.getPermissionsForUser(req.user.id);
      if (!permissions.includes(permission)) {
        return res.status(403).json({
          message: `Forbidden: requires permission "${permission}"`,
          required: permission,
        });
      }
      req.permissions = permissions;
      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Scopes a route to a single store. Store Managers may only operate
 * within their assigned store; Admins/Super Admins are unrestricted.
 */
export function requireStoreScope() {
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Not authorized' });

      const isManager = req.user.role_name === 'store_manager';
      const targetStoreId = Number(req.params.id || req.body.store_id || 0);

      if (isManager) {
        if (req.user.store_id && targetStoreId && req.user.store_id !== targetStoreId) {
          return res.status(403).json({ message: 'Forbidden: store scope limited to your assigned store' });
        }
        if (!req.user.store_id) {
          return res.status(403).json({ message: 'Forbidden: store manager has no assigned store' });
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}