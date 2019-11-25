import test from 'ava';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import app from '../../app';
import RecipeModel from '../../models/recipe';
import RecipeService from '../../services/recipe-service';

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
  const recipe = new RecipeModel({
    title: 'Boiled Egg',
  });
  await recipe.save();
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

const checkLitmusResponse = (t, res) => {
  t.is(res.status, 200);
  t.is(res.text, `Test route for ${res.req.path} [${res.req.method}]`);
};

test.serial('litmus tests for GET/POST/DELETE/PUT', async t => {
  t.plan(8);
  const { app, recipeRoute } = t.context;
  const litmusRoute = `${recipeRoute}/litmus`;
  let res;

  res = await request(app).get(litmusRoute);
  checkLitmusResponse(t, res);

  res = await request(app).post(litmusRoute);
  checkLitmusResponse(t, res);

  res = await request(app).delete(litmusRoute);
  checkLitmusResponse(t, res);

  res = await request(app).put(litmusRoute);
  checkLitmusResponse(t, res);
});
