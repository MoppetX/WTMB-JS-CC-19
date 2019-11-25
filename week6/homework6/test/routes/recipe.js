import test from 'ava';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import app from '../../app';
import RecipeModel from '../../models/recipe';
import RecipeService from '../../services/recipe-service';
import UserModel from '../../models/user';

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

test.after.always(async () => {
  UserModel.deleteMany();
  await mongoose.disconnect();
  await mongod.stop();
});
