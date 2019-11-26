import test from 'ava';
import RecipeModel from '../../models/recipe';

test.beforeEach(t => {
  t.context = {
    recipe: {
      title: 'Eggs on Toast',
    },
    errorMsgs: {
      title: {
        required: 'Title is required',
        tooShort: 'Title should be longer than 1 letter',
        tooLong: 'The maximum characters allowed is 30',
      },
    },
  };
});

const getErrorMsg = (badRecipe, badProperty) => {
  const error = badRecipe.validateSync();
  return error.errors[badProperty].message;
};

test('creating new recipe with valid input', async t => {
  t.plan(4);

  const validRecipe = new RecipeModel(t.context.recipe);
  const error = validRecipe.validateSync();

  t.falsy(error);
  t.true(Array.isArray(validRecipe.versions));
  t.true(Array.isArray(validRecipe.users));
  t.truthy(validRecipe.created);
});
