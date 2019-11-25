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

// router.delete('/all', async (req, res) => {
//   await RecipeService.delete();
//   console.log(await RecipeService.find().length);
//
//   res.send('USERS PURGED');
// });
//
//
// router.get(`/:id`, async (req, res) => {
//   const id = req.params.id;
//   const user = await RecipeService.findById(id);
//
//   res.send(user);
//   // res.render('user', { user, users });
// });
//
//
// router.post(`/`, async (req, res) => {
//   try {
//     const user = await RecipeService.add(req.body);
//     res.send(user);
//   } catch (err) {
//     console.error(err.message);
//   }
// });
//
//
// router.delete(`/:id`, async (req, res) => {
//   const id = req.params.id;
//   await RecipeService.deleteById(id);
//
//   res.send('ok');
// });

module.exports = router;
