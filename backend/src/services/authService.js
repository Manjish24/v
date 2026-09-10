import bcrypt from "bcryptjs";
import { dataService } from "./dataService.js";
import { generateToken } from "../utils/generateToken.js";

export const authService = {
  findUserByEmail: async (email) => {
    return await dataService.getUserByEmail(email);
  },
  findUserById: async (id) => {
    return await dataService.getUserById(id);
  },
  comparePasswords: async (candidatePassword, hashedPassword) => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  },
  hashPassword: async (password) => {
    return await bcrypt.hash(password, 10);
  },
  generateUserToken: (user) => {
    return generateToken(user);
  }
};
