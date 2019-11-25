import test from 'ava';
import UserModel from '../../models/user';

test.beforeEach(t => {
  t.context = {
    user: {
      name: 'steve',
      email: 'steve@mail.com',
      password: '123567',
    },
    errorMsgs: {
      name: {
        required: 'User name is required',
        tooShort: 'Name should be longer than 1 letter',
        tooLong: 'The maximum characters allowed is 20 characters',
      },
      email: {
        required: 'Email is required',
        failedValidation: '@ is not a valid email address!',
        notUnique: 'A User with this Email already exists',
      },
      password: {
        required: 'Password is required',
        tooShort: 'the minimum length is 6 characters',
        tooLong: 'the maximum characters allowed is 30',
      },
    },
  };
});

const getErrorMsg = (badUser, badProperty) => {
  const error = badUser.validateSync();
  return error.errors[badProperty].message;
};

test('creating new user with valid input', async t => {
  t.plan(6);

  const validUser = new UserModel(t.context.user);
  const error = validUser.validateSync();

  t.falsy(error);
  t.true(Array.isArray(validUser.recipes));
  t.true(validUser.recipes.length === 0);
  // TODO SAI: for how many things should I check here?
  t.is(validUser.name, t.context.user.name);
  t.is(validUser.email, t.context.user.email);
  t.is(validUser.password, t.context.user.password);
});

test('creating a user with invalid username', async t => {
  t.plan(3);
  const badProperty = 'name';

  t.context.user.name = null;
  let errorMsgExpected = t.context.errorMsgs.name.required;
  let badUser = new UserModel(t.context.user);
  let errorMsg = getErrorMsg(badUser, badProperty);
  t.is(errorMsg, errorMsgExpected);

  t.context.user.name = 's';
  errorMsgExpected = t.context.errorMsgs.name.tooShort;
  badUser = new UserModel(t.context.user);
  errorMsg = getErrorMsg(badUser, badProperty);
  t.is(errorMsg, errorMsgExpected);

  t.context.user.name = 'sssssssssssssssssssssssssssssss';
  errorMsgExpected = t.context.errorMsgs.name.tooLong;
  badUser = new UserModel(t.context.user);
  errorMsg = getErrorMsg(badUser, badProperty);
  t.is(errorMsg, errorMsgExpected);
});

test('creating a user with invalid email', async t => {
  t.plan(2);
  const badProperty = 'email';

  t.context.user.email = null;
  let errorMsgExpected = t.context.errorMsgs.email.required;
  let badUser = new UserModel(t.context.user);
  let errorMsg = getErrorMsg(badUser, badProperty);
  t.is(errorMsg, errorMsgExpected);

  t.context.user.email = '@';
  errorMsgExpected = t.context.errorMsgs.email.failedValidation;
  badUser = new UserModel(t.context.user);
  errorMsg = getErrorMsg(badUser, badProperty);
  t.is(errorMsg, errorMsgExpected);
});

test('creating a user with invalid password', async t => {
  // t.plan(3);
  const badProperty = 'password';

  t.context.user.password = null;
  let errorMsgExpected = t.context.errorMsgs.password.required;
  let badUser = new UserModel(t.context.user);
  let errorMsg = getErrorMsg(badUser, badProperty);
  t.is(errorMsg, errorMsgExpected);

  t.context.user.password = 's';
  errorMsgExpected = t.context.errorMsgs.password.tooShort;
  badUser = new UserModel(t.context.user);
  errorMsg = getErrorMsg(badUser, badProperty);
  t.is(errorMsg, errorMsgExpected);

  t.context.user.password = 'sssssssssssssssssssssssssssssss';
  errorMsgExpected = t.context.errorMsgs.password.tooLong;
  badUser = new UserModel(t.context.user);
  errorMsg = getErrorMsg(badUser, badProperty);
  t.is(errorMsg, errorMsgExpected);
});
