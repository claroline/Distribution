import {makeReducer} from '#/main/core/utilities/redux'

// generic reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'
import {reducer as resourceReducer} from '#/main/core/layout/resource/reducer'

// dropzone reducers
import {reducer as editorReducer} from './editor/reducer'

import {
  DROPZONE_LOAD
} from './editor/actions'

const userReducer = makeReducer({}, {})

const dropzoneReducer = makeReducer({}, {
  [DROPZONE_LOAD]: (state, action) => {
    return action.dropzone
  }
})

const myDropsReducer = makeReducer({}, {})

const reducer = {
  user: userReducer,
  dropzone: dropzoneReducer,
  myDrops: myDropsReducer,
  dropzoneForm: editorReducer,

  // generic reducers
  currentRequests: apiReducer,
  modal: modalReducer,
  resourceNode: resourceReducer
}

export {
  reducer
}
