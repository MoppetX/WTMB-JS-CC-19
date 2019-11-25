const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [2, 'Title should be longer than 1 letter'],
    maxlength: [30, 'The maximum characters allowed is 30 characters'],
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
