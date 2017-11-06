import isEmpty from 'lodash/isEmpty'
import {createSelector} from 'reselect'

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
  validating,
  pendingChanges,
  errors,
  data,
  valid,
  saveEnabled
}
