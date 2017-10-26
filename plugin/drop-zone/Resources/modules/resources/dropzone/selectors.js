import isEmpty from 'lodash/isEmpty'
import {createSelector} from 'reselect'

const dropzoneForm = state => state.dropzoneForm
const formHasPendingChanges = createSelector(
  [dropzoneForm],
  (dropzoneForm) => dropzoneForm.pendingChanges
)
const formIsOpened = createSelector(
  [dropzoneForm],
  (dropzoneForm) => !!dropzoneForm.data
)
const formData = createSelector(
  [dropzoneForm],
  (dropzoneForm) => dropzoneForm.data
)
const formParametersData = createSelector(
  [formData],
  (formData) => formData.parameters
)
const formDisplayData = createSelector(
  [formData],
  (formData) => formData.display
)
const formNotificationsData = createSelector(
  [formData],
  (formData) => formData.notifications
)
const formCriteriaData = createSelector(
  [formData],
  (formData) => formData.criteria
)
const formErrors = createSelector(
  [dropzoneForm],
  (dropzoneForm) => dropzoneForm.errors
)
const formValidating = createSelector(
  [dropzoneForm],
  (dropzoneForm) => dropzoneForm.validating
)
const formValid = createSelector(
  [formErrors],
  (formErrors) => isEmpty(formErrors)
)

const dropzone = state => state.dropzone

const dropzoneId = createSelector(
  [dropzone],
  (dropzone) => dropzone.id
)

export const select = {
  dropzoneId,
  formHasPendingChanges,
  formIsOpened,
  formData,
  formParametersData,
  formDisplayData,
  formNotificationsData,
  formCriteriaData,
  formErrors,
  formValidating,
  formValid
}
