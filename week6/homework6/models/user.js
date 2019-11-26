const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const { userModelErrorMsgs: errMsgs } = require('./modelErrorMsgs');

// const Recipe = require('./recipe');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, errMsgs.NAME.REQUIRED],
    // defining an error message
    minlength: [2, errMsgs.NAME.TOO_SHORT],
    maxlength: [20, errMsgs.NAME.TOO_LONG],
  },
  email: {
    type: String,
    required: [true, errMsgs.EMAIL.REQUIRED],
    // TODO: extra errorMsg for the unique validator
    unique: [true, 'A User with this Email already exists'],
    validate: {
      validator: function(valueToValidate) {
        return isEmail(valueToValidate);
      },
      message: () => errMsgs.EMAIL.FAILED_VALIDATION,
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'the minimum length is 6 characters'],
    maxlength: [30, 'the maximum characters allowed is 30'],
  },
  recipes: [
    {
      type: mongoose.SchemaTypes.ObjectId,
    },
  ],
});

// UserSchema.plugin(require('mongoose-autopopulate'));

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
