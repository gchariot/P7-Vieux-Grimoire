const fs = require("fs");
const Book = require("../models/book");
const mongoose = require("mongoose");

// Utilitaire pour le calcul de la moyenne des notes
const calculateAverageRating = (ratings) => {
  if (ratings.length === 0) return 0;
  const total = ratings.reduce((acc, { grade }) => acc + grade, 0);
  return (total / ratings.length).toFixed(1);
};

// Création d'un livre avec gestion des images
exports.createBook = async (req, res) => {
  const { userId } = req.auth;
  const bookData = JSON.parse(req.body.book);
  const imageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    : null;

  if (!imageUrl) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const book = new Book({
    ...bookData,
    userId,
    imageUrl,
    averageRating: calculateAverageRating(bookData.ratings),
  });

  try {
    await book.save();
    res.status(201).json({ message: "Book created successfully" });
  } catch (error) {
    fs.unlinkSync(`images/${req.file.filename}`);
    res.status(500).json({ error: "Error saving the book" });
  }
};

// Récupération de tous les livres
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Error fetching books" });
  }
};

// Récupération d'un livre spécifique
exports.getOneBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Error fetching the book" });
  }
};

// Modification d'un livre avec gestion de l'image existante
exports.modifyBook = async (req, res) => {
  const bookData = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  try {
    const book = await Book.findById(req.params.id);
    if (book.userId !== req.auth.userId) {
      if (req.file) fs.unlinkSync(`images/${req.file.filename}`);
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (req.file) {
      const oldFilename = book.imageUrl.split("/images/")[1];
      fs.unlinkSync(`images/${oldFilename}`);
    }

    await Book.findByIdAndUpdate(req.params.id, {
      ...bookData,
      _id: req.params.id,
    });
    res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating the book" });
  }
};

// Suppression d'un livre
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const filename = book.imageUrl.split("/images/")[1];
    fs.unlinkSync(`images/${filename}`);
    await Book.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting the book" });
  }
};
