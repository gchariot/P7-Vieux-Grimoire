const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String },
      grade: { type: Number },
    },
  ],
  averageRating: { type: Number, default: 0 },
});

bookSchema.pre("save", function (next) {
  if (this.isModified("ratings")) {
    const ratings = this.ratings.map((rating) => rating.grade);
    const sumOfRatings = ratings.reduce((acc, curr) => acc + curr, 0);
    this.averageRating =
      ratings.length > 0 ? Math.round(sumOfRatings / ratings.length) : 0;
  }
  next();
});

module.exports = mongoose.model("Book", bookSchema);
