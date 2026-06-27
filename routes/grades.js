import express from "express";

import Grade from "../models/grade.js";

const router = express.Router();

// Create a single grade entry
router.post("/grades", async (req, res) => {
  try {
    let newDocument = req.body;

    // rename fields for backwards compatibility
    if (newDocument.student_id) {
      newDocument.learner_id = newDocument.student_id;
      delete newDocument.student_id;
    }

    const result = await Grade.create(newDocument);
  } catch (error) {
    res.send(result).status(204);
  }
});

// Get a single grade entry
router.get("/:id", async (req, res) => {
  try {
    const result = await Grade.findById(req.params.id)

    if (!result) res.send("Not found").status(404);
    res.status(200).send(result);
  } catch {
    res.send(result).status(200);
  }
});

// Add a score to a grade entry
router.delete("/:id", async (req, res) => {
  try {
    const result = await Grade.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send("Not found");
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {
  try {
    const result = await Grade.findByIdAndUpdate(
      req.params.id,
      { $pull: { scores: req.body } },
      { new: true }
    );

    if (!result) return res.status(404).send("Not found");
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Delete a single grade entry
router.delete("/:id", async (req, res) => {
  try {
    const result = await Grade.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send("Not found");
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get route for backwards compatibility
router.get("/student/:id", async (req, res) => {
  res.redirect(`/learner/${req.params.id}`);
});

// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
  try {
    let query = { learner_id: req.params.id };

    // Check for class_id query parameter
    if (req.query.class) query.class_id = req.query.class;

    const result = await Grade.find(query);
    if (!result || result.length === 0) return res.status(404).send("Not found");
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Delete a learner's grade data
router.delete("/learner/:id", async (req, res) => {
  try {
    // Using deleteMany because a learner could have multiple grade documents
    const result = await Grade.deleteMany({ learner_id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).send("Not found");
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get a class's grade data
router.get("/class/:id", async (req, res) => {
  try {
    let query = { class_id: req.params.id };

    // Check for learner_id parameter
    if (req.query.learner) query.learner_id = req.query.learner;

    const result = await Grade.find(query);
    if (!result || result.length === 0) return res.status(404).send("Not found");
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Update a class id
router.patch("/class/:id", async (req, res) => {
  try {
    const result = await Grade.updateMany(
      { class_id: req.params.id },
      { $set: { class_id: req.body.class_id } }
    );

    if (result.matchedCount === 0) return res.status(404).send("Not found");
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Delete a class
router.delete("/class/:id", async (req, res) => {
  try {
    const result = await Grade.deleteMany({ class_id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).send("Not found");
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
