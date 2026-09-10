/**
 * Role-Based Access Control (RBAC) Middleware
 * Enforces strict backend authorization based on trusted server-side user data.
 */

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before accessing this resource.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to perform this action.'
      });
    }

    next();
  };
}
