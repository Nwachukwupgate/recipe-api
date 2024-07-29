const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');
const validate = require('../middleware/validate');
const upload = require('../config/muter');


router.get('/', recipesController.getRecipes);
router.get('/:id', recipesController.getRecipeById);
router.post('/', upload.single('image'), recipesController.createRecipe);
router.put('/:id', upload.single('image'),  recipesController.updateRecipe);
router.delete('/:id', recipesController.deleteRecipe);

module.exports = router;
