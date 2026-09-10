import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { dataService } from "../services/dataService.js";
import { validateUser } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { validateSignupInput } from "../utils/validators.js";
import { emailService } from "../services/emailService.js";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "trainee",
      adminSecretKey = "",
      organization = "India Meteorological Department (IMD)",
      department = "",
      designation = "",
      phone = "",
      qualifications = "",
      experience = "",
      skills = [],
      interests = []
    } = req.body;

    const inputValidation = validateSignupInput({ name, email, password, role });
    if (!inputValidation.isValid) {
      return res.status(400).json({ success: false, message: inputValidation.errors.join(", ") });
    }

    // Prevent unauthorized creation of admin accounts
    let assignedRole = role;
    if (role === "admin") {
      const validAdminKey = process.env.ADMIN_SECRET_KEY || "moes_admin_secret_2026";
      if (adminSecretKey !== validAdminKey) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Administrative role registration requires valid MoES authorization key."
        });
      }
    }

    const existingUser = await dataService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: "A user with this official email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const status = assignedRole === "trainer" ? "pending" : "approved";

    const newUser = {
      id: `usr-${uuidv4().substring(0, 8)}`,
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
      status,
      organization,
      department,
      designation,
      phone,
      qualifications,
      experience,
      skills: Array.isArray(skills) ? skills : typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : [],
      interests: Array.isArray(interests) ? interests : typeof interests === "string" ? interests.split(",").map((i) => i.trim()) : [],
      certificates: [],
      createdAt: new Date().toISOString()
    };

    await dataService.createUser(newUser);
    await emailService.sendWelcomeEmail(newUser);

    const token = generateToken(newUser);
    const { password: _, ...userSafe } = newUser;

    res.status(201).json({
      success: true,
      message: status === "pending"
        ? "Trainer registration submitted! Your account is awaiting IMD administrator approval."
        : "Registration successful!",
      token,
      user: userSafe
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error during registration.", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await dataService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or credentials." });
    }

    const token = generateToken(user);
    const { password: _, ...userSafe } = user;

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: userSafe
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login.", error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await dataService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    const { password: _, ...userSafe } = user;
    res.status(200).json({ success: true, user: userSafe });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve profile.", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      organization,
      department,
      designation,
      phone,
      qualifications,
      experience,
      skills,
      interests,
      certificates
    } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (organization) updates.organization = organization;
    if (department) updates.department = department;
    if (designation) updates.designation = designation;
    if (phone) updates.phone = phone;
    if (qualifications) updates.qualifications = qualifications;
    if (experience) updates.experience = experience;
    if (skills !== undefined) {
      updates.skills = Array.isArray(skills) ? skills : typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : [];
    }
    if (interests !== undefined) {
      updates.interests = Array.isArray(interests) ? interests : typeof interests === "string" ? interests.split(",").map((i) => i.trim()) : [];
    }
    if (certificates !== undefined) updates.certificates = certificates;

    const updatedUser = await dataService.updateUser(req.user.id, updates);
    const { password: _, ...userSafe } = updatedUser;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: userSafe
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update profile.", error: error.message });
  }
};
