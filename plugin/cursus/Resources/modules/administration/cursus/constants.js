import {trans} from '#/main/core/translation'

const DEFAULT_ORDER = 500

const SESSION_NOT_STARTED = 0
const SESSION_OPEN = 1
const SESSION_CLOSED = 2

const REGISTRATION_AUTO = 0
const REGISTRATION_MANUAL = 1
const REGISTRATION_PUBLIC = 2

const REGISTRATION_TYPES = {
  [REGISTRATION_AUTO]: trans('event_registration_automatic', {}, 'cursus'),
  [REGISTRATION_MANUAL]: trans('event_registration_manual', {}, 'cursus'),
  [REGISTRATION_PUBLIC]: trans('event_registration_public', {}, 'cursus')
}

export const constants = {
  DEFAULT_ORDER,
  SESSION_NOT_STARTED,
  SESSION_OPEN,
  SESSION_CLOSED,
  REGISTRATION_AUTO,
  REGISTRATION_MANUAL,
  REGISTRATION_PUBLIC,
  REGISTRATION_TYPES
}