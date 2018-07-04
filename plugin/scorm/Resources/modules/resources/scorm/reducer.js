import cloneDeep from 'lodash/cloneDeep'

import {makeReducer, combineReducers} from '#/main/core/scaffolding/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

import {
  TRACKING_UPDATE,
  SUMMARY_PIN_TOGGLE,
  SUMMARY_OPEN_TOGGLE
} from '#/plugin/scorm/resources/scorm/player/actions'

const reducer = {
  scorm: makeReducer({}, {}),
  trackings: makeReducer({}, {
    [TRACKING_UPDATE]: (state, action) => {
      const newState = cloneDeep(state)
      const scoId = action.tracking['sco']['id']
      newState[scoId] = action.tracking

      return newState
    }
  }),
  summary: combineReducers({
    pinned: makeReducer(false, {
      [SUMMARY_PIN_TOGGLE]: (state) => !state
    }),
    opened: makeReducer(false, {
      [SUMMARY_OPEN_TOGGLE]: (state) => !state
    })
  }),
  results: makeListReducer('results', {})
}

export {
  reducer
}
