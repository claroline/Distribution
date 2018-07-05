import cloneDeep from 'lodash/cloneDeep'

import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

import {
  TRACKING_UPDATE
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
  results: makeListReducer('results', {})
}

export {
  reducer
}
