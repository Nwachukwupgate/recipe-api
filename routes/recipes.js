const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const validate = require('../middleware/validate');

router.get('/', recipesController.getRecipes);
router.get('/:id', recipesController.getRecipeById);
router.post('/', upload.single('image'), validate.recipe, recipesController.createRecipe);
router.put('/:id', upload.single('image'), validate.recipe, recipesController.updateRecipe);
router.delete('/:id', recipesController.deleteRecipe);

module.exports = router;
