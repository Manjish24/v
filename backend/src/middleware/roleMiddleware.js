export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized: Authentication required." });
    }
    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires '${role}' role. Current role: '${req.user.role}'.`
      });
    }
    next();
  };
};

export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized: Authentication required." });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires one of [${allowedRoles.join(", ")}]. Current role: '${req.user.role}'.`
      });
    }
    next();
  };
};

// Aliases for compatibility
export const authorizeRoles = requireRoles;
export const roleMiddleware = requireRoles;
