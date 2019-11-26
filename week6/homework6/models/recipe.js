const mongoose = require('mongoose');
const { recipeModelErrorMsgs: errMsgs } = require('./modelErrorMsgs');

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, errMsgs.TITLE.REQUIRED],
    minlength: [2, errMsgs.TITLE.TOO_SHORT],
    maxlength: [30, errMsgs.TITLE.TOO_LONG],
  },
  created: {
    type: Date,
    default: Date.now,
  },
  versions: [
    {
      type: Object,
    },
  ],
  users: [
    {
      type: mongoose.SchemaTypes.ObjectId,
    },
  ],
});

const RecipeModel = mongoose.model('recipe', RecipeSchema);

module.exports = RecipeModel;
