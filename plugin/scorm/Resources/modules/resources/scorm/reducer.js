import {makeReducer} from '#/main/core/scaffolding/reducer'

const reducer = {
  scorm: makeReducer({}, {}),
  trackings: makeReducer({}, {})
}

export {
  reducer
}
