exports.recipe = (req, res, next) => {
    const { title, ingredients, instructions } = req.body;
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ error: 'Title, ingredients, and instructions are required' });
    }
    next();
  };
  