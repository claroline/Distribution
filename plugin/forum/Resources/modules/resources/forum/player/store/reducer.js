import {combineReducers, makeReducer} from '#/main/app/store/reducer'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'
import {makeInstanceAction} from '#/main/app/store/actions'
import {FORM_SUBMIT_SUCCESS} from '#/main/app/content/form/store/actions'

import {RESOURCE_LOAD} from '#/main/core/resource/store/actions'

import {
  SUBJECT_LOAD,
  SUBJECT_FORM_OPEN,
  SUBJECT_FORM_CLOSE,
  SUBJECT_EDIT,
  SUBJECT_STOP_EDIT
} from '#/plugin/forum/resources/forum/player/store/actions'
import {selectors} from '#/plugin/forum/resources/forum/store/selectors'

const reducer = combineReducers({
  form: makeFormReducer(`${selectors.STORE_NAME}.subjects.form`, {
    showSubjectForm: false,
    editingSubject: false
  }, {
    showSubjectForm: makeReducer(false, {
      [SUBJECT_FORM_OPEN]: () => true,
      [SUBJECT_FORM_CLOSE]: () => false
    }),
    editingSubject: makeReducer(false, {
      [SUBJECT_EDIT]: () => true,
      [SUBJECT_STOP_EDIT]: () => false
    })
  }),
  list: makeListReducer(`${selectors.STORE_NAME}.subjects.list`, {
    sortBy: {property: 'sticked', direction: -1}
  }, {
    invalidated: makeReducer(false, {
      [makeInstanceAction(RESOURCE_LOAD, selectors.STORE_NAME)]: () => true
    })
  }),
  current: makeReducer({}, {
    [FORM_SUBMIT_SUCCESS+`/${selectors.STORE_NAME}.subjects.form`]: (state, action) => action.updatedData,
    [SUBJECT_LOAD]: (state, action) => action.subject
  }),
  messages: makeListReducer(`${selectors.STORE_NAME}.subjects.messages`, {
    pageSize: 10,
    sortBy: {property: 'creationDate', direction : 1}
  }, {
    invalidated: makeReducer(false, {
      [makeInstanceAction(RESOURCE_LOAD, selectors.STORE_NAME)]: () => true
    })
  })
})

export {
  reducer
}
