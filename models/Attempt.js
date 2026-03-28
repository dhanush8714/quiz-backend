import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

// ✅ SAFE METHOD (OPTIONAL POPULATE WHEN NEEDED)
attemptSchema.methods.populateUser = function () {
  return this.populate("user", "name email");
};

export default mongoose.model("Attempt", attemptSchema);