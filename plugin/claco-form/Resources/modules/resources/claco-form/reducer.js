import cloneDeep from 'lodash/cloneDeep'
import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeResourceReducer} from '#/main/core/resource/reducer'
import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'

import {
  RESOURCE_PROPERTY_UPDATE,
  RESOURCE_PARAMS_PROPERTY_UPDATE
} from '#/plugin/claco-form/resources/claco-form/editor/actions'
import {
  MESSAGE_RESET,
  MESSAGE_UPDATE
} from '#/plugin/claco-form/resources/claco-form/actions'

import {reducer as editorReducer} from '#/plugin/claco-form/resources/claco-form/editor/reducer'
import {categoryReducers} from '#/plugin/claco-form/resources/claco-form/editor/category/reducers'
import {keywordReducers} from '#/plugin/claco-form/resources/claco-form/editor/keyword/reducers'
import {fieldReducers} from '#/plugin/claco-form/resources/claco-form/editor/field/reducers'
import {
  reducer as entriesReducer,
  myEntriesCountReducers,
  currentEntryReducers
} from '#/plugin/claco-form/resources/claco-form/player/entry/reducers'

const messageReducers = makeReducer({}, {
  [MESSAGE_RESET]: () => {
    return {
      content: null,
      type: null
    }
  },
  [MESSAGE_UPDATE]: (state, action) => {
    return {
      content: action.content,
      type: action.status
    }
  }
})

const clacoFormReducer = makeReducer({}, {
  // replaces clacoForm data after success updates
  [FORM_SUBMIT_SUCCESS+'/clacoFormForm']: (state, action) => action.updatedData,
  [RESOURCE_PROPERTY_UPDATE]: (state, action) => {
    const newState = cloneDeep(state)
    newState[action.property] = action.value

    return newState
  },
  [RESOURCE_PARAMS_PROPERTY_UPDATE]: (state, action) => {
    const newState = cloneDeep(state)
    newState['details'][action.property] = action.value

    return newState
  }
})

const reducer = makeResourceReducer({}, {
  user: makeReducer({}, {}),
  clacoForm: clacoFormReducer,
  clacoFormForm: editorReducer,
  isAnon: makeReducer({}, {}),
  canGeneratePdf: makeReducer({}, {}),
  categories: categoryReducers,
  keywords: keywordReducers,
  fields: fieldReducers,
  entries: entriesReducer,
  myEntriesCount: myEntriesCountReducers,
  currentEntry: currentEntryReducers,
  cascadeLevelMax: makeReducer({}, {}),
  message: messageReducers,
  roles: makeReducer({}, {}),
  myRoles: makeReducer({}, {})
})

export {
  reducer
}