import {makeReducer, combineReducers} from '#/main/core/scaffolding/reducer'

import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'

import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'
import {AGENDA_UPDATE_FILTER_TYPE, AGENDA_UPDATE_FILTER_WORKSPACE, AGENDA_INIT_EVENT} from '#/plugin/agenda/actions'

const reducer = {
  current: makeFormReducer(
    'events.current',
    {},
    {
      data: makeReducer({}, {
        [AGENDA_INIT_EVENT]: (state, action) => {
          console.log(action)
          return state
        }
      })
    }
  ),
  filters: combineReducers({
    types: makeReducer(['event', 'task'], {
      [AGENDA_UPDATE_FILTER_TYPE] : (state, action) => action.filters
    }),
    workspaces: makeReducer([], {
      [AGENDA_UPDATE_FILTER_WORKSPACE]: (state, action) => action.filters
    })
  })
}

export {
  reducer
}
