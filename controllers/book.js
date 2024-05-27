const Book = require("../models/book");
const fs = require("fs");

// Utilitaires pour la réponse en cas d'erreur
const handleError = (res, error) =>
  res.status(500).json({ message: "Server error", details: error.message });
const handleNotFound = (res) =>
  res.status(404).json({ message: "Book not found" });

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find(); // Utilise Mongoose pour récupérer tous les livres
    res.status(200).json(books); // Envoie les livres comme réponse JSON
  } catch (error) {
    next(error);
  }
};

// Récupère et renvoie les trois livres les mieux notés
exports.getTopRatedBooks = async (req, res, next) => {
  try {
    const topRatedBooks = await Book.find()
      .sort({ averageRating: -1 })
      .limit(3);
    res.status(200).json(topRatedBooks);
  } catch (error) {
    next(error);
  }
};

exports.getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    book ? res.status(200).json(book) : handleNotFound(res);
  } catch (error) {
    next(error);
  }
};
// Crée un nouveau livre avec l'image téléchargée
exports.createBook = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "File missing" });
  }

  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id; // Ignore l'ID du front-end pour des raisons de sécurité

  const filename = req.file.filename;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${filename}`,
  });

  try {
    await book.save();
    res.status(201).json({ message: "Book saved" });
  } catch (error) {
    fs.unlinkSync(`images/${filename}`);
    next(error);
  }
};

exports.addBookRating = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return handleNotFound(res);

    const hasRated = book.ratings.some(
      (rating) => rating.userId === req.auth.userId
    );
    if (hasRated) {
      return res
        .status(400)
        .json({ message: "User has already rated this book" });
    }

    book.ratings.push({ userId: req.auth.userId, grade: req.body.rating });
    await book.save();
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

exports.modifyBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return handleNotFound(res);
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Unauthorized request" });
    }

    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

    if (req.file) fs.unlinkSync(`images/${book.imageUrl.split("/images/")[1]}`);
    await Book.findByIdAndUpdate(req.params.id, {
      ...bookObject,
      _id: req.params.id,
    });
    res.status(200).json({ message: "Book modified!" });
  } catch (error) {
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return handleNotFound(res);
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Unauthorized request" });
    }

    fs.unlink(`images/${book.imageUrl.split("/images/")[1]}`, async (err) => {
      if (err) return next(err);
      await Book.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Book deleted" });
    });
  } catch (error) {
    next(error);
  }
};
