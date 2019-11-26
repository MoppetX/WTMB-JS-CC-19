const userModelErrorMsgs = {
  NAME: {
    REQUIRED: 'User name is required',
    TOO_SHORT: 'Name should be longer than 1 letter',
    TOO_LONG: 'The maximum characters allowed is 20 characters',
  },
  EMAIL: {
    REQUIRED: 'Email is required',
    FAILED_VALIDATION: 'Not a valid email address!',
    // notUnique: 'A User with this Email already exists',
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    TOO_SHORT: 'the minimum length is 6 characters',
    TOO_LONG: 'the maximum characters allowed is 30',
  },
};

const recipeModelErrorMsgs = {
  TITLE: {
    REQUIRED: 'Title is required',
    TOO_SHORT: 'Title should be longer than 1 letter',
    TOO_LONG: 'The maximum characters allowed is 30',
  },
};

module.exports = { userModelErrorMsgs, recipeModelErrorMsgs };
