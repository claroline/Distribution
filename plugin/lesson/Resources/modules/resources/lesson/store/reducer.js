import {makeReducer} from '#/main/core/scaffolding/reducer'

const reducer = {
  resourceNode: makeReducer({}, {}),
  lesson: makeReducer({}, {}),
}

export {
  reducer
}