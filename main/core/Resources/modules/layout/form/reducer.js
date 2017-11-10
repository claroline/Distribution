import cloneDeep from 'lodash/cloneDeep'
import difference from 'lodash/difference'
import set from 'lodash/set'

import {makeReducer, combineReducers, reduceReducers} from '#/main/core/utilities/redux'

import {
  FORM_RESET,
  FORM_VALIDATE,
  FORM_SUBMIT,
  FORM_UPDATE_PROP
} from './actions'

const defaultState = {
  new: false,
  validating: false,
  pendingChanges: false,
  errors: {},
  data: {}
}

const newReducer = makeReducer(defaultState.new, {
  [FORM_RESET]: (state, action) => !!action.new
})

/**
 * Reduces the validating state of the form.
 * (becomes true on form submission)
 */
const validatingReducer = makeReducer(defaultState.validating, {
  [FORM_RESET]: () => defaultState.validating,
  [FORM_SUBMIT]: (state, action) => true,
  [FORM_UPDATE_PROP]: (state, action) => false
})

const pendingChangesReducer = makeReducer(defaultState.pendingChanges, {
  [FORM_RESET]: () => defaultState.pendingChanges,
  [FORM_UPDATE_PROP]: (state, action) => true
})

/**
 * Reduces the errors of the form.
 */
const errorsReducer = makeReducer(defaultState.errors, {
  [FORM_RESET]: () => defaultState.errors,
  [FORM_VALIDATE]: (state, action) => action.errors
})

/**
 * Reduces the data of the form.
 */
const dataReducer = makeReducer(defaultState.data, {
  [FORM_RESET]: (state, action) => action.data || defaultState.data,
  [FORM_UPDATE_PROP]: (state, action) => {
    const newState = cloneDeep(state)

    // update correct property
    set(newState, action.propName, action.propValue)

    return newState
  }
})

const baseReducer = {
  new: newReducer,
  validating: validatingReducer,
  pendingChanges: pendingChangesReducer,
  errors: errorsReducer,
  data: dataReducer
}

/**
 * Creates reducers for forms.
 *
 * @param {object}   customReducers - an object containing custom reducers.
 * @param {function} validate       - the validation function of the form
 *
 * @returns {function}
 */
function makeFormReducer(customReducers = {}, validate = () => true) {
  const reducer = {}

  // enhance base form reducers with custom ones if any
  Object.keys(baseReducer).map(reducerName => {
    reducer[reducerName] = customReducers[reducerName] ?
      reduceReducers(baseReducer[reducerName], customReducers[reducerName]) : baseReducer[reducerName]
  })

  // get custom keys
  const rest = difference(Object.keys(customReducers), Object.keys(baseReducer))
  rest.map(reducerName =>
    reducer[reducerName] = customReducers[reducerName]
  )

  return combineReducers(reducer)
}

export {
  makeFormReducer
}
