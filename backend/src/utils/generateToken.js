import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const payload = {
    id: user.id || user._id,
    email: user.email,
    role: user.role,
    name: user.name
  };
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || "moes_imd_capacity_connect_secure_jwt_secret_key_2026",
    { expiresIn: "7d" }
  );
};
