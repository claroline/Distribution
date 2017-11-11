import cloneDeep from 'lodash/cloneDeep'
import {makeReducer} from '#/main/core/utilities/redux'

import {
  DROPS_LOAD,
  CURRENT_DROP_LOAD,
  CURRENT_DROP_RESET,
  CORRECTION_FORM_LOAD,
  CORRECTION_FORM_RESET,
  CORRECTION_FORM_UPDATE,
  CORRECTION_UPDATE,
  CORRECTION_REMOVE
} from './actions'

const currentDropReducer = makeReducer({}, {
  [CURRENT_DROP_LOAD]: (state, action) => {
    return action.drop
  },
  [CURRENT_DROP_RESET]: () => {
    return {}
  },
  [CORRECTION_UPDATE]: (state, action) => {
    if (state.id === action.correction.drop) {
      const corrections = cloneDeep(state.corrections)
      const index = corrections.findIndex(c => c.id === action.correction.id)

      if (index > -1) {
        corrections[index] = action.correction
      } else {
        corrections.push(action.correction)
      }

      return Object.assign({}, state, {corrections: corrections})
    } else {
      return state
    }
  },
  [CORRECTION_REMOVE]: (state, action) => {
    const corrections = cloneDeep(state.corrections)
    const index = corrections.findIndex(c => c.id === action.correctionId)

    if (index > -1) {
      corrections.splice(index, 1)
    }

    return Object.assign({}, state, {corrections: corrections})
  }
})

const dropsReducer = makeReducer({
  data: [],
  totalResults: 0
}, {
  [DROPS_LOAD]: (state, action) => {
    return action.drops
  }
})

const correctionFormReducer = makeReducer({}, {
  [CORRECTION_FORM_LOAD]: (state, action) => {
    return action.correction
  },
  [CORRECTION_FORM_RESET]: () => {
    return {}
  },
  [CORRECTION_FORM_UPDATE]: (state, action) => {
    return Object.assign({}, state, {[action.property]: action.value})
  }
})

const reducer = {
  drops: dropsReducer,
  currentDrop: currentDropReducer,
  correctionForm: correctionFormReducer
}

export {
  reducer
}
