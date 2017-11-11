import {makeReducer} from '#/main/core/utilities/redux'

// generic reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'
import {reducer as resourceReducer} from '#/main/core/layout/resource/reducer'

// dropzone reducers
import {reducer as editorReducer} from './editor/reducer'
import {reducer as playerReducer} from './player/reducer'
import {reducer as correctionReducer} from './correction/reducer'

const reducer = {
  user: makeReducer({}, {}),
  dropzone: editorReducer.dropzone,
  dropzoneForm: editorReducer.dropzoneForm,
  myDrop: playerReducer.myDrop,
  //myDrops: playerReducer.myDrops,
  drops: correctionReducer.drops,
  currentDrop: correctionReducer.currentDrop,
  correctionForm: correctionReducer.correctionForm,

  // generic reducers
  currentRequests: apiReducer,
  modal: modalReducer,
  resourceNode: resourceReducer
}

export {
  reducer
}
