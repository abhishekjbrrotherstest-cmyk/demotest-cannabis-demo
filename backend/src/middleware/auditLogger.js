import AuditLog from '../models/auditLogModel.js';

/**
 * Records every state-changing request (POST / PUT / DELETE) to audit_logs.
 */
export function auditLogger(req, res, next) {
  res.on('finish', async () => {
    try {
      const method = req.method.toUpperCase();
      if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return;

      const entityGuess =
        (req.baseUrl || '').split('/').pop() ||
        (req.originalUrl || '/').split('/').find((p) => p && p !== 'api') ||
        'unknown';

      await AuditLog.write({
        user_id: req.user ? req.user.id : null,
        action: `${method} ${req.originalUrl.split('?')[0]}`,
        entity: entityGuess,
        entity_id: req.params.id || req.body.id || null,
        ip_address: req.ip || req.socket?.remoteAddress || null,
      });
    } catch (err) {
      // Audit logging must never break the request.
      console.error('[auditLogger] failed to write log:', err.message);
    }
  });
  next();
}