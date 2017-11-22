import {trans} from '#/main/core/translation'

const MANUAL_STATE_NOT_STARTED = 0
const MANUAL_STATE_ALLOW_DROP = 1
const MANUAL_STATE_FINISHED = 2
const MANUAL_STATE_PEER_REVIEW = 3
const MANUAL_STATE_ALLOW_DROP_AND_PEER_REVIEW = 4
const MANUAL_STATE_ALLOW_WAITING_FOR_PEER_REVIEW = 5

const TEACHER_PLANNING_STATES = [
  {value: MANUAL_STATE_NOT_STARTED, label: trans('manual_state_not_started', {}, 'dropzone')},
  {value: MANUAL_STATE_ALLOW_DROP, label: trans('manual_state_allow_drop', {}, 'dropzone')},
  {value: MANUAL_STATE_FINISHED, label: trans('manual_state_finished', {}, 'dropzone')}
]

const PEER_PLANNING_STATES = [
  {value: MANUAL_STATE_NOT_STARTED, label: trans('manual_state_not_started', {}, 'dropzone')},
  {value: MANUAL_STATE_ALLOW_DROP, label: trans('manual_state_allow_drop', {}, 'dropzone')},
  {value: MANUAL_STATE_PEER_REVIEW, label: trans('manual_state_peer_review', {}, 'dropzone')},
  {value: MANUAL_STATE_ALLOW_DROP_AND_PEER_REVIEW, label: trans('manual_state_allow_drop_and_peer_review', {}, 'dropzone')},
  {value: MANUAL_STATE_FINISHED, label: trans('manual_state_finished', {}, 'dropzone')}
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

export const constants = {
  MANUAL_STATE_NOT_STARTED,
  MANUAL_STATE_ALLOW_DROP,
  MANUAL_STATE_FINISHED,
  MANUAL_STATE_PEER_REVIEW,
  MANUAL_STATE_ALLOW_DROP_AND_PEER_REVIEW,
  TEACHER_PLANNING_STATES,
  PEER_PLANNING_STATES,
  DOCUMENT_TYPES,
  DOCUMENT_TYPES_NAMES
}