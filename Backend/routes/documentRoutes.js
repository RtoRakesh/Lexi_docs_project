const { Router } = require("express");
const Document = require("../models/DocumentModel");

const documentRoutes = Router();

documentRoutes.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    const newDoc = new Document({
      title,
      content,
      user: req.user._id,
    });

    await newDoc.save();
    res.status(201).json({ newDoc });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error while posting document" });
  }
});

documentRoutes.get("/", async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id });
    res.status(200).json({ documents });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error while getting documents" });
  }
});

documentRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updatedDocument = await Document.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, content, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(201).json({ updatedDocument });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Fail to update document" });
  }
});

documentRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDocument = await Document.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!deletedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(201).json({ deletedDocument });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Fail to delete document" });
  }
});

module.exports = documentRoutes;
