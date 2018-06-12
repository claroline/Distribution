import {makeReducer, combineReducers} from '#/main/core/scaffolding/reducer'

import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'

import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'
import {AGENDA_UPDATE_FILTER_TYPE, AGENDA_UPDATE_FILTER_WORKSPACE} from '#/plugin/agenda/actions'

const reducer = {
  list: makeListReducer('events.list', {}, {
    invalidated: makeReducer(false, {
      [FORM_SUBMIT_SUCCESS+'/events.current']: () => true // todo : find better
    })
  }),
  current: makeFormReducer('events.current', {}, {}),
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
