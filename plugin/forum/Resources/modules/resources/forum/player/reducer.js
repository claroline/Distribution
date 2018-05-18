import {combineReducers, makeReducer} from '#/main/core/scaffolding/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {
  SUBJECT_LOAD,
  SUBJECT_FORM_OPEN,
  SUBJECT_FORM_CLOSE,
  SUBJECT_EDIT,
  SUBJECT_STOP_EDIT,
  MESSAGE_UPDATE,
  MESSAGES_SORT_TOGGLE
} from '#/plugin/forum/resources/forum/player/actions'


const reducer = combineReducers({
  form: makeFormReducer('subjects.form', {
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

  list: makeListReducer('subjects.list', {
    // sortBy: [{property: 'meta.sticky', direction: -1}]
  }),
  current: makeReducer({}, {
    [SUBJECT_LOAD]: (state, action) => action.subject
  }),
  messages: makeListReducer('subjects.messages', {
    sortOrder: -1
  }, {
    sortOrder: makeReducer(-1, {
      [MESSAGES_SORT_TOGGLE]: (state) => 0-state
    })
  })
})

export {
  reducer
}
