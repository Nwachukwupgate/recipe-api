const Recipe = require('../models/recipe');
const cloudinary = require('cloudinary').v2;

// Fetch a paginated list of recipes
exports.getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Recipe.countDocuments();
    const recipes = await Recipe.find().skip(skip).limit(limit);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      recipes,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Missing file' });
    }

    // Upload image to Cloudinary using the buffer
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'recipes' },
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
        }

        const imageUrl = result.secure_url;

        // Create and save the recipe
        const newRecipe = new Recipe({ title, ingredients, instructions, imageUrl });
        newRecipe.save()
          .then(() => res.status(201).json(newRecipe))
          .catch(err => res.status(500).json({ error: err.message }));
      }
    ).end(req.file.buffer); // Use the buffer from multer

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;

    // Check if there is a file in the request
    let imageUrl = req.body.imageUrl; // Retain existing image URL if not updating the image

    if (req.file) {
      // Upload image to Cloudinary using the buffer
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'recipes' },
          (error, result) => {
            if (error) {
              console.error(error);
              return reject(new Error('Error uploading image to Cloudinary'));
            }
            resolve(result);
          }
        );

        stream.end(req.file.buffer); // Use the buffer from multer
      });

      imageUrl = result.secure_url; // Update imageUrl with the newly uploaded image URL
    }

    // Update the recipe in the database
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, ingredients, instructions, imageUrl },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.status(200).json(updatedRecipe);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
