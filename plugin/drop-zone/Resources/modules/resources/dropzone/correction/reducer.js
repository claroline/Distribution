import cloneDeep from 'lodash/cloneDeep'

import {makeReducer} from '#/main/core/utilities/redux'
import {makeListReducer} from '#/main/core/layout/list/reducer'

import {
  DROPS_LOAD,
  CURRENT_DROP_LOAD,
  CURRENT_DROP_RESET,
  CORRECTION_FORM_LOAD,
  CORRECTION_FORM_RESET,
  CORRECTION_FORM_UPDATE,
  CORRECTION_FORM_CRITERION_UPDATE,
  CORRECTION_UPDATE,
  CORRECTION_REMOVE
} from '#/plugin/drop-zone/resources/dropzone/correction/actions'
import {
  DOCUMENT_UPDATE
} from '#/plugin/drop-zone/resources/dropzone/player/actions'


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
  },
  [DOCUMENT_UPDATE]: (state, action) => {
    const documents = cloneDeep(state.documents)
    const index = documents.findIndex(d => d.id === action.document.id)

    if (index > -1) {
      documents[index] = action.document
    }

    return Object.assign({}, state, {documents: documents})
  }
})

const dropsReducer = makeReducer({}, {
  [DROPS_LOAD]: (state, action) => {
    return action.drops.data
  }
})

const dropsResultsReducer = makeReducer({}, {
  [DROPS_LOAD]: (state, action) => {
    return action.drops.totalResults
  }
})

const dropsListReducer = makeListReducer({
  data: dropsReducer,
  totalResults: dropsResultsReducer
}, {})

const correctionFormReducer = makeReducer({}, {
  [CORRECTION_FORM_LOAD]: (state, action) => {
    return action.correction
  },
  [CORRECTION_FORM_RESET]: () => {
    return {}
  },
  [CORRECTION_FORM_UPDATE]: (state, action) => {
    return Object.assign({}, state, {[action.property]: action.value})
  },
  [CORRECTION_FORM_CRITERION_UPDATE]: (state, action) => {
    const grades = cloneDeep(state.grades)
    const index = grades.findIndex(g => g.criterion === action.criterionId)

    if (index > -1) {
      const grade = Object.assign({}, grades[index], {value: action.value})
      grades[index] = grade
    }

    return Object.assign({}, state, {grades: grades})
  }
})

const reducer = {
  drops: dropsListReducer,
  currentDrop: currentDropReducer,
  correctionForm: correctionFormReducer
}

export {
  reducer
}
