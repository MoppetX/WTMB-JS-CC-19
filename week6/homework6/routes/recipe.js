const express = require('express');
const router = express.Router();
const RecipeService = require('../services/recipe-service');

// const litmusResponseMsg = req =>
//   `Test route for ${req.originalUrl} [${req.method}]`;
//
// router.get('/litmus', (req, res) => res.send(litmusResponseMsg(req)));
// router.post('/litmus', (req, res) => res.send(litmusResponseMsg(req)));
// router.delete('/litmus', (req, res) => res.send(litmusResponseMsg(req)));
// router.put('/litmus', (req, res) => res.send(litmusResponseMsg(req)));

router.get('/all', async (req, res) => {
  try {
    const recipes = await RecipeService.findAll();
    if (recipes.length === 0) res.status(404);
    res.send(recipes);
    // res.render('recipes', { recipes });
  } catch (err) {
    res.send(err.response.data.message);
  }
});

router.post(`/`, async (req, res) => {
  try {
    const recipe = await RecipeService.add(req.body);
    res.send(recipe);
  } catch (err) {
    res.send(err.response.data.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await RecipeService.findById(id);

    if (!recipe) {
      res.status(404).send(`Error: Could not find recipe for id >${id}<`);
    } else {
      res.send(recipe);
    }
  } catch (err) {
    res.status(500).send(err.response.data.message);
  }
});

router.get('/', async (req, res) => {
  try {
    const { query, body } = req;
    const recipes = await RecipeService.find(query).sort(body.sort);

    if (recipes.length === 0) {
      res.status(404).send(`Error: Could not find recipes`);
    } else {
      res.send(recipes);
    }
  } catch (err) {
    res.send(err.response.data.message);
  }
});

router.put('/', async (req, res) => {
  try {
    const { query, body } = req;
    const update = await RecipeService.update(query, body);
    res.send(update);
  } catch (err) {
    res.send(err.response.data.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const status = await RecipeService.deleteById(id);
    res.send(status);
  } catch (err) {
    res.send(err.response.data.message);
  }
});

module.exports = router;
