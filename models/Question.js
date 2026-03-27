import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length === 4,
        message: "Exactly 4 options are required",
      },
    },

    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },

    category: {
      type: String,
      required: true,
      enum: ["HTML", "JavaScript", "React", "C++", "Python"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Optional: prevent sending correct answer to frontend
questionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.correctAnswer;
  return obj;
};

export default mongoose.model("Question", questionSchema);