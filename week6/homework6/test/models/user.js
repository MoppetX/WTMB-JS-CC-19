import test from 'ava';
import UserModel from '../../models/user';

const {
  userModelErrorMsgs: newErrMsgs,
} = require('../../models/modelErrorMsgs');

const getErrMsgArray = property =>
  Object.entries(newErrMsgs[property.toUpperCase()]).map(entry => entry[1]);

test.beforeEach(t => {
  t.context = {
    user: {
      name: 'steve',
      email: 'steve@mail.com',
      password: '123567',
    },
  };
});

test('creating new user with valid input', async t => {
  t.plan(6);

  const validUser = new UserModel(t.context.user);
  const error = validUser.validateSync();

  t.falsy(error);
  t.true(Array.isArray(validUser.recipes));
  t.true(validUser.recipes.length === 0);
  t.is(validUser.name, t.context.user.name);
  t.is(validUser.email, t.context.user.email);
  t.is(validUser.password, t.context.user.password);
});

const testInput = (input, index, t, property, errorMessages) => {
  // setting a field on the context user object to an invalid value
  t.context.user[property] = input;
  // because errorMessages is an array, we need to keep up in it within out forEach
  let errorMsgExpected = errorMessages[index];

  // after creating badUser, using a mongoose validator func
  // to catch the error message that would be generated
  // if badUser.save() were called
  let badUser = new UserModel(t.context.user);
  const error = badUser.validateSync();
  let errorMsg = error.errors[property].message;

  // compare the returned message to the expected
  t.is(errorMsg, errorMsgExpected);
};

test('creating a user with invalid username', async t => {
  t.plan(3);

  const property = 'name';
  const badInput = [null, 's', 'sssssssssssssssssssssssssssssss'];
  const errorMessages = getErrMsgArray(property);

  badInput.forEach((input, index) => {
    testInput(input, index, t, property, errorMessages);
  });
});

test('creating a user with invalid email', async t => {
  t.plan(2);

  const property = 'email';
  const badInput = [null, '@'];
  const errorMessages = getErrMsgArray(property);

  badInput.forEach((input, index) => {
    testInput(input, index, t, property, errorMessages);
  });
});

test('creating a user with invalid password', async t => {
  t.plan(3);

  const property = 'password';
  const badInput = [null, 's', 'sssssssssssssssssssssssssssssss'];
  const errorMessages = getErrMsgArray(property);

  badInput.forEach((input, index) => {
    testInput(input, index, t, property, errorMessages);
  });
});
