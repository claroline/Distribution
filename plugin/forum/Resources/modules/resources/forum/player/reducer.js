import cloneDeep from 'lodash/cloneDeep'
import {combineReducers, makeReducer} from '#/main/core/scaffolding/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {
  SUBJECT_LOAD,
  SUBJECT_REMOVE
} from '#/plugin/forum/resources/forum/player/actions'

const reducer = combineReducers({
  form: makeFormReducer('subjects.form'),
  list: makeListReducer('subjects.list'),
  current: makeReducer({}, {
    [SUBJECT_LOAD]: (state, action) => action.subject,
    [SUBJECT_REMOVE]: (state, action) => {
      const subjects = cloneDeep(state)
      const index = subjects.findIndex(c => c.id === action.subjectId)

      if (index >= 0) {
        subjects.splice(index, 1)
      }

      return subjects
    }
  })
})

export {
  reducer
}
