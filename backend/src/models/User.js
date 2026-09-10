import mongoose from "mongoose";

export const UserRoles = {
  TRAINEE: "trainee",
  TRAINER: "trainer",
  ADMIN: "admin"
};

export const UserStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected"
};

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"], trim: true },
  email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, "Password is required"], minlength: 6 },
  role: { type: String, enum: ["trainee", "trainer", "admin"], default: "trainee" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
  organization: { type: String, default: "India Meteorological Department (IMD)" },
  department: { type: String, default: "" },
  designation: { type: String, default: "" },
  phone: { type: String, default: "" },
  qualifications: { type: String, default: "" },
  experience: { type: String, default: "" },
  skills: [{ type: String }],
  interests: [{ type: String }],
  certificates: [
    {
      certificateId: String,
      title: String,
      courseTitle: String,
      issuer: String,
      score: Number,
      issueDate: Date,
      year: Number
    }
  ]
}, { timestamps: true });

export const validateUser = (user) => {
  const errors = [];
  if (!user.name) errors.push("Name is required");
  if (!user.email) errors.push("Email is required");
  if (!user.role || !Object.values(UserRoles).includes(user.role)) {
    errors.push("Valid role (trainee, trainer, admin) is required");
  }
  return { isValid: errors.length === 0, errors };
};

let UserModel;
try {
  UserModel = mongoose.model("User", UserSchema);
} catch {
  UserModel = mongoose.models.User;
}

export default UserModel;
