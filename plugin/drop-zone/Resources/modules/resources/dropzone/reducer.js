import {makeReducer} from '#/main/core/utilities/redux'
import {makePageReducer} from '#/main/core/layout/page/reducer'

// generic reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'
import {reducer as resourceReducer} from '#/main/core/layout/resource/reducer'

// dropzone reducers
import {reducer as editorReducer} from '#/plugin/drop-zone/resources/dropzone/editor/reducer'
import {reducer as playerReducer} from '#/plugin/drop-zone/resources/dropzone/player/reducer'
import {reducer as correctionReducer} from '#/plugin/drop-zone/resources/dropzone/correction/reducer'
import {reducer as configurationReducer} from '#/plugin/drop-zone/plugin/configuration/reducer'

const reducer = makePageReducer({}, {
  user: makeReducer({}, {}),
  dropzone: editorReducer.dropzone,
  dropzoneForm: editorReducer.dropzoneForm,
  myDrop: playerReducer.myDrop,
  peerDrop: playerReducer.peerDrop,
  nbCorrections: playerReducer.nbCorrections,
  drops: correctionReducer.drops,
  currentDrop: correctionReducer.currentDrop,
  correctorDrop: correctionReducer.correctorDrop,
  corrections: correctionReducer.corrections,
  tools: configurationReducer.tools,
  userEvaluation: makeReducer({}, {}),
  teams: makeReducer({}, {}),
  errorMessage: makeReducer({}, {}),

  // generic reducers
  currentRequests: apiReducer,
  modal: modalReducer,
  resourceNode: resourceReducer
})

export {
  reducer
}
