const jwt = require("jsonwebtoken");

// Middleware d'authentification
module.exports = (req, res, next) => {
  try {
    // Vérification de l'en-tête d'autorisation
    if (!req.headers.authorization) {
      throw new Error("No authorization header found");
    }
    // Extraction et Vérification du Token
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Bearer token not found");
    }
    // Décode et Vérifie le Token
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    if (!userId) {
      throw new Error("Token does not contain user ID");
    }

    req.auth = { userId: userId };
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ error: "Unauthorized: " + error.message });
  }
};
