import isEmpty from 'lodash/isEmpty'
import {createSelector} from 'reselect'
import {constants} from './constants'

const user = state => state.user

const userId = createSelector(
  [user],
  (user) => user && user.id ? user.id : null
)

const dropzone = state => state.dropzone

const dropzoneId = createSelector(
  [dropzone],
  (dropzone) => dropzone.id
)
const dropzoneParameters = createSelector(
  [dropzone],
  (dropzone) => dropzone.parameters
)
const dropzoneDisplay = createSelector(
  [dropzone],
  (dropzone) => dropzone.display
)
const dropzoneNotifications = createSelector(
  [dropzone],
  (dropzone) => dropzone.notifications
)

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

const myDrop = state => state.myDrop
const myDrops = state => state.myDrops

const myDropId = createSelector(
  [myDrop],
  (myDrop) => myDrop && myDrop.id ? myDrop.id : null
)

const isDropEnabled = createSelector(
  [dropzone],
  (dropzone) => {
    const currentDate = new Date()

    return (
      dropzone.parameters.manualPlanning &&
      [constants.MANUAL_STATE_ALLOW_DROP, constants.MANUAL_STATE_ALLOW_DROP_AND_PEER_REVIEW].indexOf(dropzone.parameters.manualState) > -1
    ) ||
    (
      !dropzone.parameters.manualPlanning &&
      currentDate >= new Date(dropzone.parameters.dropStartDate) &&
      currentDate <= new Date(dropzone.parameters.dropEndDate)
    )
  }
)

const isPeerReviewEnabled = createSelector(
  [dropzone],
  (dropzone) => {
    const currentDate = new Date()

    return dropzone.parameters.peerReview && (
      (
        dropzone.parameters.manualPlanning &&
        [constants.MANUAL_STATE_PEER_REVIEW, constants.MANUAL_STATE_ALLOW_DROP_AND_PEER_REVIEW].indexOf(dropzone.parameters.manualState) > -1
      ) ||
      (
        !dropzone.parameters.manualPlanning &&
        currentDate >= new Date(dropzone.parameters.reviewStartDate) &&
        currentDate <= new Date(dropzone.parameters.reviewEndDate)
      )
    )
  }
)

export const select = {
  user,
  userId,
  dropzone,
  dropzoneId,
  dropzoneParameters,
  dropzoneDisplay,
  dropzoneNotifications,
  formHasPendingChanges,
  formIsOpened,
  formData,
  formParametersData,
  formDisplayData,
  formNotificationsData,
  formCriteriaData,
  formErrors,
  formValidating,
  formValid,
  myDrop,
  myDrops,
  myDropId,
  isDropEnabled,
  isPeerReviewEnabled
}
