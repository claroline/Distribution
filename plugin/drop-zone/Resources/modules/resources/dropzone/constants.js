import {trans} from '#/main/core/translation'

const STATE_NOT_STARTED = 0
const STATE_ALLOW_DROP = 1
const STATE_FINISHED = 2
const STATE_PEER_REVIEW = 3
const STATE_ALLOW_DROP_AND_PEER_REVIEW = 4
const STATE_WAITING_FOR_PEER_REVIEW = 5

const TEACHER_PLANNING_STATES = [
  {value: STATE_NOT_STARTED, label: trans('state_not_started', {}, 'dropzone')},
  {value: STATE_ALLOW_DROP, label: trans('state_allow_drop', {}, 'dropzone')},
  {value: STATE_FINISHED, label: trans('state_finished', {}, 'dropzone')}
]

const PEER_PLANNING_STATES = [
  {value: STATE_NOT_STARTED, label: trans('state_not_started', {}, 'dropzone')},
  {value: STATE_ALLOW_DROP, label: trans('state_allow_drop', {}, 'dropzone')},
  {value: STATE_PEER_REVIEW, label: trans('state_peer_review', {}, 'dropzone')},
  {value: STATE_ALLOW_DROP_AND_PEER_REVIEW, label: trans('state_allow_drop_and_peer_review', {}, 'dropzone')},
  {value: STATE_FINISHED, label: trans('state_finished', {}, 'dropzone')}
]

const DOCUMENT_TYPES = {
  file : {value: 0, label: trans('uploaded_files', {}, 'dropzone')},
  text: {value: 1, label: trans('rich_text_online_edition', {}, 'dropzone')},
  url: {value: 2, label: trans('url_info', {}, 'dropzone')},
  resource: {value: 3, label: trans('workspace_resources', {}, 'dropzone')}
}

const DOCUMENT_TYPES_NAMES = [
  trans('file_type', {}, 'dropzone'),
  trans('text_type', {}, 'dropzone'),
  trans('url_type', {}, 'dropzone'),
  trans('resource_type', {}, 'dropzone')
]

const DROP_TYPE_USER = 0
const DROP_TYPE_TEAM = 1

const DROP_TYPES = [
  {value: DROP_TYPE_USER, label: trans('drop_type_user', {}, 'dropzone')},
  {value: DROP_TYPE_TEAM, label: trans('drop_type_team', {}, 'dropzone')}
]

const CORRECTION_TYPES = [
  {value: 'teacher', label: trans('teacher_correction_info', {}, 'dropzone')},
  {value: 'peer', label: trans('peer_correction_info', {}, 'dropzone')}
]

const PLANNING_TYPES = [
  {value: 'manual', label: trans('manually', {}, 'dropzone')},
  {value: 'date', label: trans('by_dates', {}, 'dropzone')}
]

const EVALUATION_STATUS_PASSED = 'passed'
const EVALUATION_STATUS_FAILED = 'failed'
const EVALUATION_STATUS_COMPLETED = 'completed'
const EVALUATION_STATUS_INCOMPLETE = 'incomplete'
const EVALUATION_STATUS_NOT_ATTEMPTED = 'not_attempted'
const EVALUATION_STATUS_UNKNOWN = 'unknown'

export const constants = {
  STATE_NOT_STARTED,
  STATE_ALLOW_DROP,
  STATE_FINISHED,
  STATE_PEER_REVIEW,
  STATE_ALLOW_DROP_AND_PEER_REVIEW,
  STATE_WAITING_FOR_PEER_REVIEW,
  TEACHER_PLANNING_STATES,
  PEER_PLANNING_STATES,
  DROP_TYPE_USER,
  DROP_TYPE_TEAM,
  DROP_TYPES,
  CORRECTION_TYPES,
  PLANNING_TYPES,
  DOCUMENT_TYPES,
  DOCUMENT_TYPES_NAMES,
  EVALUATION_STATUS_PASSED,
  EVALUATION_STATUS_FAILED,
  EVALUATION_STATUS_COMPLETED,
  EVALUATION_STATUS_INCOMPLETE,
  EVALUATION_STATUS_NOT_ATTEMPTED,
  EVALUATION_STATUS_UNKNOWN
}