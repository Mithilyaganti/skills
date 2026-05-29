# Example: Vertical Slices

A vertical slice is a narrow complete behavior, not a layer.

## Good

### Saved search creation

User can create a saved search and see it in the saved-search list.

Why vertical:

- crosses UI/API/persistence as needed,
- has observable acceptance criteria,
- can be tested end-to-end,
- reduces integration risk immediately.

## Bad

### Create saved search table

Why horizontal:

- persistence only,
- not user-visible,
- cannot prove the feature works,
- pushes integration risk later.

## Better decomposition

Instead of:

1. database,
2. API,
3. UI,
4. tests,

use:

1. create and list one saved search,
2. validate duplicate names,
3. edit saved search query,
4. delete saved search with confirmation.
