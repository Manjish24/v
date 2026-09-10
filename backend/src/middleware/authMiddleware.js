import jwt from "jsonwebtoken";
import { dataService } from "../services/dataService.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access denied. No authentication token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "moes_imd_capacity_connect_secure_jwt_secret_key_2026");

    const user = await dataService.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User session expired or user no longer exists." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token.", error: error.message });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user ? req.user.role : "anonymous"}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

export const checkApproved = (req, res, next) => {
  if (req.user && req.user.role !== "admin" && req.user.status !== "approved") {
    return res.status(403).json({
      success: false,
      message: "Account pending approval. An IMD/MoES administrator must verify your account before accessing this portal."
    });
  }
  next();
};
