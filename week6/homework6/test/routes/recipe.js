import test from 'ava';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import app from '../../app';
import RecipeModel from '../../models/recipe';
import RecipeService from '../../services/recipe-service';
import UserService from '../../services/user-service';

// Start MongoDB instance
const mongod = new MongoMemoryServer();

test.before(async () => {
  const uri = await mongod.getConnectionString();
  const debug = false;

  await mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      if (debug) {
        console.log('Fake Mongo connected');
      }
    })
    .catch(err => console.error(err.message));

  // populating  database with dummy data
  const recipe1 = new RecipeModel({
    title: 'Boiled Eggs',
  });
  await recipe1.save();

  const recipe2 = new RecipeModel({
    title: 'Fried Eggs',
  });
  recipe2.save();
});

test.beforeEach(async t => {
  t.context = {
    app,
    recipeRoute: '/recipe',
    newRecipe: {
      title: 'Scrambled Eggs',
    },
  };
});

test('get all recipes', async t => {
  const { app, recipeRoute } = t.context;
  const res = await request(app).get(`${recipeRoute}/all`);

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.true(res.body.length >= 1);
});

test.serial('create a recipe', async t => {
  const { app, recipeRoute, newRecipe } = t.context;

  const res = await request(app)
    .post(`${recipeRoute}/`)
    .send(newRecipe);
  const createdRecipe = res.body;

  t.is(res.status, 200);
  t.is(createdRecipe.title, newRecipe.title);
  t.true(Array.isArray(createdRecipe.users));
  t.true(Array.isArray(createdRecipe.versions));

  // Verify that the recipe was created in DB
  const recipeInDb = await RecipeService.findById(createdRecipe._id);
  t.is(recipeInDb.title, createdRecipe.title);
});

test.serial('get a recipe via params', async t => {
  const { app, recipeRoute, newRecipe } = t.context;
  const [recipeInDb] = await RecipeService.find({ title: newRecipe.title });
  const newRecipeId = recipeInDb._id.toString();

  const res = await request(app).get(`${recipeRoute}/${newRecipeId}`);
  t.is(res.status, 200);

  const fetchedRecipeId = res.body._id.toString();
  t.is(fetchedRecipeId, newRecipeId);
});

test.serial('get recipes via query', async t => {
  const { app, recipeRoute } = t.context;

  const res = await request(app)
    .get(`${recipeRoute}/`)
    .query({
      title: /Eggs/,
    })
    .send({
      sort: 'title',
    });

  t.true(true);
  const foundRecipes = res.body;

  t.is(res.status, 200);
  t.true(Array.isArray(foundRecipes));
});

test.after.always(async () => {
  RecipeModel.deleteMany();
  await mongoose.disconnect();
  await mongod.stop();
});
