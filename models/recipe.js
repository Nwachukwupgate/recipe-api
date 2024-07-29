const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
  imageUrl: { type: String }
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;