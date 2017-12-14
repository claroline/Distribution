import {combineReducers, makeReducer} from '#/main/core/utilities/redux'

import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

import {FORM_RESET} from '#/main/core/data/form/actions'

const reducer = combineReducers({
  picker: makeListReducer('organizations.picker'),
  list: makeListReducer('organizations.list', {}, {}, {
    sortable: false,
    paginated: false
  }),
  current: makeFormReducer('organizations.current', {}, {
    workspaces: makeListReducer('organizations.current.workspaces', {}, {
      invalidated: makeReducer(false, {
        [FORM_RESET+'/organizations.current']: () => true // todo : find better
      })
    }),
    users: makeListReducer('organizations.current.users', {}, {
      invalidated: makeReducer(false, {
        [FORM_RESET+'/organizations.current']: () => true // todo : find better
      })
    }),
    groups: makeListReducer('organizations.current.groups', {}, {
      invalidated: makeReducer(false, {
        [FORM_RESET+'/organizations.current']: () => true // todo : find better
      })
    })
  })
})

export {
  reducer
}
