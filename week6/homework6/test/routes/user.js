import test from 'ava';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import app from '../../app';
import UserModel from '../../models/user';
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
  const user = new UserModel({
    name: 'First user',
    email: 'firstUser@mail.com',
    password: '123567',
  });
  await user.save();
});

test.beforeEach(async t => {
  t.context = {
    app,
    userRoute: '/user',
    newUser: {
      name: 'STEVE',
      email: 'steve@mail.com',
      password: '123567',
    },
  };
});

const checkLitmusResponse = (t, res) => {
  t.is(res.status, 200);
  t.is(res.text, `Test route for ${res.req.path} [${res.req.method}]`);
};

test.serial('litmus tests for GET/POST/DELETE/PUT', async t => {
  t.plan(8);
  const { app, userRoute } = t.context;
  const litmusRoute = `${userRoute}/litmus`;
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

test('get all users', async t => {
  const { app, userRoute } = t.context;
  const res = await request(app).get(`${userRoute}/all`);

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.true(res.body.length >= 1);
});

test.serial('create a user', async t => {
  const { app, userRoute, newUser } = t.context;
  const res = await request(app)
    .post(`${userRoute}/`)
    .send(newUser);

  t.is(res.status, 200);
  t.is(res.body.name, newUser.name);
  t.is(res.body.email, newUser.email);
  t.is(res.body.password, newUser.password);

  // Verify that user is created in DB / find(query) returns an array
  const [newUserInDb] = await UserService.find({ email: newUser.email });
  t.is(newUserInDb.name, newUser.name);
});

test.serial('get a user via params', async t => {
  const { app, userRoute, newUser: user } = t.context;
  const [userInDb] = await UserService.find({ email: user.email });
  const userId = userInDb._id.toString();

  const res = await request(app).get(`${userRoute}/${userId}`);
  t.is(res.status, 200);

  const fetchedUserId = res.body._id.toString();
  t.is(fetchedUserId, userId);
});

test.serial('get a user via query', async t => {
  const { app, userRoute, newUser } = t.context;
  const [userInDb] = await UserService.find({ email: newUser.email });
  const userId = userInDb._id.toString();

  const res = await request(app)
    .get(`${userRoute}/`)
    .query({ _id: userId });

  const [foundUser] = res.body;
  const foundUserId = foundUser._id.toString();

  t.is(res.status, 200);
  t.is(foundUserId, userId);
});

test.serial('update a user', async t => {
  const { app, userRoute, newUser: user } = t.context;
  const [userInDb] = await UserService.find({ email: user.email });
  const userId = userInDb._id.toString();
  const newName = 'Steve';

  const res = await request(app)
    .put(`${userRoute}/`)
    .send({
      query: { _id: userId },
      update: { name: newName },
    });

  t.true(true);
  t.is(res.status, 200);
  t.true(res.body.ok === 1);

  // Verify that user was updated in the DB
  const fetched = await request(app)
    .get(`${userRoute}/`)
    .query({ _id: userId });

  const [updatedUser] = fetched.body;
  t.is(fetched.status, 200);
  t.is(updatedUser.name, newName);
});

test.serial('delete one user via params', async t => {
  const { app, userRoute, newUser: user } = t.context;
  const [userInDb] = await UserService.find({ email: user.email });
  const userId = userInDb._id.toString();

  const res = await request(app).delete(`${userRoute}/${userId}`);

  t.is(res.status, 200);
  t.true(res.body.ok === 1);

  // Verify that user is no longer in the DB
  const fetch = await request(app).get(`${userRoute}/${userId}`);

  t.is(fetch.status, 404);
});

// clearing Dummy data
// disconnect from and stop MongoDB
test.after.always(async () => {
  UserModel.deleteMany();
  await mongoose.disconnect();
  await mongod.stop();
});
