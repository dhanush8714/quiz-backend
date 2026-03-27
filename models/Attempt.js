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

// ✅ Optional: populate user automatically
attemptSchema.pre(/^find/, function (next) {
  this.populate("user", "name email"); // only needed fields
  next();
});

export default mongoose.model("Attempt", attemptSchema);