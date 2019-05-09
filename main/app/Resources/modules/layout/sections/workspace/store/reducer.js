import {combineReducers, makeReducer} from '#/main/app/store/reducer'

const reducer = {
  workspace: makeReducer(null),
  tools: makeReducer([]),
  userProgression: makeReducer(null),
  accessErrors: makeReducer(null)
}

export {
  reducer
}
