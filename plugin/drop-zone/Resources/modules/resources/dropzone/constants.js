import {trans} from '#/main/core/translation'

const TEACHER_PLANNING_STATES = [
  {value: 'notStarted', label: trans('manual_state_not_started', {}, 'dropzone')},
  {value: 'allowDrop', label: trans('manual_state_allow_drop', {}, 'dropzone')},
  {value: 'finished', label: trans('manual_state_finished', {}, 'dropzone')}
]

const PEER_PLANNING_STATES = [
  {value: 'notStarted', label: trans('manual_state_not_started', {}, 'dropzone')},
  {value: 'allowDrop', label: trans('manual_state_allow_drop', {}, 'dropzone')},
  {value: 'peerReview', label: trans('manual_state_peer_review', {}, 'dropzone')},
  {value: 'allowDropAndPeerReview', label: trans('manual_state_allow_drop_and_peer_review', {}, 'dropzone')},
  {value: 'finished', label: trans('manual_state_finished', {}, 'dropzone')}
]

export const constants = {
  TEACHER_PLANNING_STATES,
  PEER_PLANNING_STATES
}