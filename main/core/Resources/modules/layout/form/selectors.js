import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import {createSelector} from 'reselect'

// retrieves a form instance in the store
const form = (state, formName) => get(state, formName)

const validating = (formState) => formState.validating
const pendingChanges = (formState) => formState.pendingChanges
const errors = (formState) => formState.errors
const data = (formState) => formState.data

const valid = createSelector(
  [errors],
  (errors) => isEmpty(errors)
)

const saveEnabled = createSelector(
  [pendingChanges, validating, valid],
  (pendingChanges, validating, valid) => pendingChanges && (!validating || valid)
)

export const select = {
  form,
  validating,
  pendingChanges,
  errors,
  data,
  valid,
  saveEnabled
}
