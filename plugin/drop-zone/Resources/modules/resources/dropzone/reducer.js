import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'

import {makeReducer} from '#/main/core/utilities/redux'

// generic reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'
import {reducer as resourceReducer} from '#/main/core/layout/resource/reducer'

const userReducer = makeReducer({}, {})
const dropzoneReducer = makeReducer({}, {})

const reducer = {
  user: userReducer,
  dropzone: dropzoneReducer,

  // generic reducers
  currentRequests: apiReducer,
  modal: modalReducer,
  resourceNode: resourceReducer
}

export {
  reducer
}
