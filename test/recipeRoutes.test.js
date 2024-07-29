const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('../models/recipe');
const recipeRoutes = require('../routes/recipes');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use('/api/recipes', recipeRoutes);

beforeAll(async () => {
  const url = process.env.MONGODB_URI;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Recipe API', () => {
  let recipeId;

  it('create a new recipe with an image', async () => {
    const imagePath = path.join(__dirname, 'test-image.jpg'); // path to a test image

    // Create a readable stream for the image file
    const imageStream = fs.createReadStream(imagePath);

    const response = await request(app)
      .post('/api/recipes')
      .set('Content-Type', 'multipart/form-data')
      .field('title', 'Test Recipe')
      .field('ingredients', 'Test ingredients')
      .field('instructions', 'Test instructions')
      .attach('image', imageStream, 'test-image.jpg'); // Attach image file

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    recipeId = response.body._id;
  });

  it('fetch a paginated list of recipes', async () => {
    const response = await request(app).get('/api/recipes');
    expect(response.status).toBe(200);
    expect(response.body.recipes).toBeInstanceOf(Array);
  });

  it('fetch a recipe by id', async () => {
    const response = await request(app).get(`/api/recipes/${recipeId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', recipeId);
  });

  it('update a recipe with a new image', async () => {
    const imagePath = path.join(__dirname, 'test-image-updated.jpg'); // path to a different test image

    // Create a readable stream for the new image file
    const imageStream = fs.createReadStream(imagePath);

    const response = await request(app)
      .put(`/api/recipes/${recipeId}`)
      .set('Content-Type', 'multipart/form-data')
      .field('title', 'Updated Recipe')
      .field('ingredients', 'Updated ingredients')
      .field('instructions', 'Updated instructions')
      .attach('image', imageStream, 'test-image-updated.jpg'); // Attach new image file

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Updated Recipe');
  });

  it('delete a recipe', async () => {
    const response = await request(app).delete(`/api/recipes/${recipeId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Recipe deleted successfully');
  });
});
