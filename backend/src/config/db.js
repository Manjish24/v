import mongoose from "mongoose";
import { dataService } from "../services/dataService.js";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      mongoose.set("strictQuery", false);
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000
      });
      console.log("==================================================");
      console.log(` CAPACITY CONNECT MongoDB Connected: ${conn.connection.host}`);
      console.log(" Mode: MongoDB Cluster / Native Database");
      console.log(" Status: Online");
      console.log("==================================================");
      await dataService.init();
      return conn;
    } catch (err) {
      console.warn("==================================================");
      console.warn(` Notice: MongoDB connection to '${mongoUri}' was unreachable: ${err.message}`);
      console.warn(" Seamlessly falling back to persistent data engine.");
      console.warn("==================================================");
    }
  }

  // Fallback to robust persistent file/memory engine
  await dataService.init();
  console.log("==================================================");
  console.log(" CAPACITY CONNECT Database & Storage initialized");
  console.log(" Mode: Persistent Data Store (MoES/IMD Cadre Dataset)");
  console.log(" Status: Ready");
  console.log("==================================================");
};
