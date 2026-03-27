import mongoose from "mongoose";

const scoreSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // ✅ link to User
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
    },

    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // ✅ adds createdAt
);

export default mongoose.model("Score", scoreSchema);