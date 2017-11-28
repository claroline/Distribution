import cloneDeep from 'lodash/cloneDeep'
import difference from 'lodash/difference'
import merge from 'lodash/merge'
import set from 'lodash/set'

import {makeInstanceReducer, combineReducers, reduceReducers} from '#/main/core/utilities/redux'

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

const newReducer = makeInstanceReducer(defaultState.new, {
  [FORM_RESET]: (state, action) => !!action.isNew
})

/**
 * Reduces the validating state of the form.
 * (becomes true on form submission)
 */
const validatingReducer = makeInstanceReducer(defaultState.validating, {
  [FORM_RESET]: () => defaultState.validating,
  [FORM_SUBMIT]: () => true,
  [FORM_UPDATE_PROP]: () => false
})

const pendingChangesReducer = makeInstanceReducer(defaultState.pendingChanges, {
  [FORM_RESET]: () => defaultState.pendingChanges,
  [FORM_UPDATE_PROP]: () => true
})

/**
 * Reduces the errors of the form.
 */
const errorsReducer = makeInstanceReducer(defaultState.errors, {
  [FORM_RESET]: () => defaultState.errors,
  [FORM_VALIDATE]: (state, action) => action.errors
})

/**
 * Reduces the data of the form.
 */
const dataReducer = makeInstanceReducer(defaultState.data, {
  [FORM_RESET]: (state, action) => action.data || {},
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
 * Creates reducer for forms.
 *
 * @param {string} formName      - the name of the form.
 * @param {object} initialState  - the initial state of the form instance.
 * @param {object} customReducer - an object containing custom handlers.
 *
 * @returns {function}
 */
function makeFormReducer(formName, initialState = {}, customReducer = {}) {
  const reducer = {}

  const formState = merge({}, defaultState, initialState)

  // enhance base form reducers with custom ones if any
  Object.keys(baseReducer).map(reducerName => {
    reducer[reducerName] = customReducer[reducerName] ?
      reduceReducers(baseReducer[reducerName](formName, formState[reducerName]), customReducer[reducerName](formName)) : baseReducer[reducerName](formName, formState[reducerName])
  })

  // get custom keys
  const rest = difference(Object.keys(customReducer), Object.keys(baseReducer))
  rest.map(reducerName =>
    reducer[reducerName] = customReducer[reducerName]
  )

  return combineReducers(reducer)
}

export {
  makeFormReducer
}
