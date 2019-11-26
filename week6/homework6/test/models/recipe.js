import test from 'ava';
import RecipeModel from '../../models/recipe';

const {
  recipeModelErrorMsgs: newErrMsgs,
} = require('../../models/modelErrorMsgs');

const getErrMsgArray = property =>
  Object.entries(newErrMsgs[property.toUpperCase()]).map(entry => entry[1]);

test.beforeEach(t => {
  t.context = {
    recipe: {
      title: 'Eggs on Toast',
    },
  };
});

test('creating new recipe with valid input', async t => {
  t.plan(4);

  const validRecipe = new RecipeModel(t.context.recipe);
  const error = validRecipe.validateSync();

  t.falsy(error);
  t.true(
    Array.isArray(validRecipe.versions) && validRecipe.versions.length === 0,
  );
  t.true(Array.isArray(validRecipe.users));
  t.truthy(validRecipe.created);
});

const testInput = (input, index, t, property, errorMessages) => {
  // setting a field on the context recipe object to an invalid value
  t.context.recipe[property] = input;
  // because errorMessages is an array, we need to keep up in it within our forEach
  let errorMsgExpected = errorMessages[index];

  // after creating badRecipe, using a mongoose validator func
  // to catch the error message that would be generated
  // if badRecipe.save() were called
  let badRecipe = new RecipeModel(t.context.recipe);
  const error = badRecipe.validateSync();
  let errorMsg = error.errors[property].message;

  // compare the returned message to the expected
  t.is(errorMsg, errorMsgExpected);
};

test('creating a recipe with invalid title', async t => {
  const property = 'title';
  const badInputs = [null, 'e', 'sssssssssssssssssssssssssssssss'];
  const errorMessages = getErrMsgArray(property);

  badInputs.forEach((input, index) => {
    testInput(input, index, t, property, errorMessages);
  });
});
