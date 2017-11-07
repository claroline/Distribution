import cloneDeep from 'lodash/cloneDeep'

import {makeReducer} from '#/main/core/utilities/redux'

import {
  ALERT_ADD,
  ALERT_REMOVE
} from './actions'

const reducer = makeReducer([], {
  [ALERT_ADD]: (state, action) => {
    const newState = cloneDeep(state)

    newState.push(action.alert)

    return newState
  },
  [ALERT_REMOVE]: (state, action) => {

  }
})

export {
  reducer
}
