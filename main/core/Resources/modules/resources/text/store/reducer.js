import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {FORM_SUBMIT_SUCCESS} from '#/main/app/content/form/store/actions'
import {RESOURCE_LOAD} from '#/main/core/resource/store/actions'

import {reducer as editorReducer} from '#/main/core/resources/text/editor/store/reducer'

const reducer = combineReducers({
  textForm: editorReducer.textForm,
  text: makeReducer({}, {
    [RESOURCE_LOAD]: (state, action) => action.resourceData.text,
    // replaces path data after success updates
    [FORM_SUBMIT_SUCCESS+'/textForm']: (state, action) => action.updatedData
  })
})

export {
  reducer
}