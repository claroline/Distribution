import {combineReducers, makeReducer} from '#/main/core/utilities/redux'

import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'

import {FORM_RESET} from '#/main/core/data/form/actions'

const reducer = combineReducers({
  list: makeListReducer('locations.list'),
  current: makeFormReducer('locations.current', {}, {
    users: makeListReducer('locations.current.users', {}, {
      invalidated: makeReducer(false, {
        [FORM_RESET+'/locations.current']: () => true // todo : find better
      })
    }),
    organizations: makeListReducer('locations.current.organizations', {}, {
      invalidated: makeReducer(false, {
        [FORM_RESET+'/locations.current']: () => true // todo : find better
      })
    }),
    groups: makeListReducer('locations.current.groups', {}, {
      invalidated: makeReducer(false, {
        [FORM_RESET+'/locations.current']: () => true // todo : find better
      })
    })
  })
})

export {
  reducer
}
