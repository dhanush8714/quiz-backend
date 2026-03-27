import Question from "../models/Question.js";

// 🌍 Public – get questions by category
export const getQuestions = async (req, res) => {
  try {
    const category = req.params.category.trim();

    const questions = await Question.find({ category })
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 📋 Admin – get ALL questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({
      createdAt: -1,
    });

    res.json(questions);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ➕ Admin – add question
export const addQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, category } = req.body;

    if (
      !question ||
      !options ||
      options.length !== 4 ||
      correctAnswer === undefined ||
      !category
    ) {
      return res
        .status(400)
        .json({ message: "Invalid question data" });
    }

    const newQuestion = await Question.create({
      question,
      options,
      correctAnswer,
      category,
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✏️ Admin – update question
export const updateQuestion = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);

    if (!q) {
      return res
        .status(404)
        .json({ message: "Question not found" });
    }

    q.question = req.body.question ?? q.question;
    q.options = req.body.options ?? q.options;
    q.correctAnswer =
      req.body.correctAnswer ?? q.correctAnswer;
    q.category = req.body.category ?? q.category;

    const updated = await q.save();
    res.json(updated);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ❌ Admin – delete question
export const deleteQuestion = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);

    if (!q) {
      return res
        .status(404)
        .json({ message: "Question not found" });
    }

    await q.deleteOne();
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 📊 Admin stats
export const getQuestionStats = async (req, res) => {
  try {
    const total = await Question.countDocuments();

    const byCategory = await Question.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalQuestions: total,
      byCategory,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};