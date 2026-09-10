import mongoose from "mongoose";

export const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, default: "45 mins" },
  videoUrl: { type: String, default: "" },
  content: { type: String, default: "" },
  order: { type: Number, default: 1 },
  resources: [
    {
      name: String,
      type: { type: String, default: "pdf" },
      size: String,
      url: String
    }
  ]
}, { timestamps: true });

let ModuleModel;
try {
  ModuleModel = mongoose.model("Module", ModuleSchema);
} catch {
  ModuleModel = mongoose.models.Module;
}

export default ModuleModel;
