import {combineReducers, makeReducer} from '#/main/core/scaffolding/reducer'

import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'

import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'

const reducer = combineReducers({
  list: makeListReducer('events.list', {}, {
    invalidated: makeReducer(false, {
      [FORM_SUBMIT_SUCCESS+'/events.current']: () => true // todo : find better
    })
  }),
  current: makeFormReducer('events.current', {}, {
  })
})

export {
  reducer
}
