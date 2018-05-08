
import {combineReducers, makeReducer} from '#/main/core/scaffolding/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {
  SUBJECT_LOAD
} from '#/plugin/forum/resources/forum/player/actions'

const reducer = combineReducers({
  form: makeFormReducer('subjects.form'),
  list: makeListReducer('subjects.list'),
  current: makeReducer({}, {
    [SUBJECT_LOAD]: (state, action) => action.subject
  })
})

export {
  reducer
}
