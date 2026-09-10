import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize Database (MongoDB / Fallback engine)
await connectDB();

app.listen(PORT, () => {
  console.log(`>>> CAPACITY CONNECT Server running on http://localhost:${PORT}`);
  console.log(">>> Ready for Ministry of Earth Sciences / IMD Portal Evaluation");
});
