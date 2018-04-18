import {trans} from '#/main/core/translation'
import {constants as listConstants} from '#/main/core/data/list/constants'

const FIELD_TYPES = [
  {name: 'string', value: 1, label: trans('text'), hasChoice: false, hasCascade: false, answerType: 'string'},
  {name: 'number', value: 2, label: trans('number'), hasChoice: false, hasCascade: false, answerType: 'number'},
  {name: 'date', value: 3, label: trans('date'), hasChoice: false, hasCascade: false, answerType: 'date'},
  {name: 'radio', value: 4, label: trans('radio'), hasChoice: true, hasCascade: false, answerType: 'string'},
  {name: 'select', value: 5, label: trans('select'), hasChoice: true, hasCascade: true, answerType: 'string'},
  {name: 'checkboxes', value: 6, label: trans('checkboxes'), hasChoice: true, hasCascade: false, answerType: 'array'},
  {name: 'country', value: 7, label: trans('country'), hasChoice: false, hasCascade: false, answerType: 'string'},
  {name: 'email', value: 8, label: trans('email'), hasChoice: false, hasCascade: false, answerType: 'string'},
  {name: 'html', value: 9, label: trans('rich_text'), hasChoice: false, hasCascade: false, answerType: 'string'},
  {name: 'file', value: 11, label: trans('file'), hasChoice: false, hasCascade: false, answerType: 'array'},
  {name: 'boolean', value: 12, label: trans('boolean'), hasChoice: false, hasCascade: false, answerType: 'number'}
]

const FILE_TYPES = {
  'audio/*': trans('audio', {}, 'clacoform'),
  'image/*': trans('image', {}, 'clacoform'),
  'video/*': trans('video', {}, 'clacoform'),
  'application/pdf': 'PDF'
}

const ENTRY_STATUS_PENDING = 0
const ENTRY_STATUS_PUBLISHED = 1
const ENTRY_STATUS_UNPUBLISHED = 2

const CHOICE_MENU = 'menu'
const CHOICE_RANDOM = 'random'
const CHOICE_SEARCH = 'search'
const CHOICE_ADD = 'add'

const CHOICE_ALL = 'all'
const CHOICE_NONE = 'none'

const CHOICE_PUBLISHED = 'published'

const CHOICE_DOWN = 'down'
const CHOICE_UP = 'up'
const CHOICE_BOTH = 'both'

const CHOICE_MANAGER = 'manager'
const CHOICE_USER = 'user'
const CHOICE_ANONYMOUS = 'anonymous'

const DEFAULT_HOME_CHOICES = {
  [CHOICE_MENU]: trans('menu', {}, 'clacoform'),
  [CHOICE_RANDOM]: trans('random_mode', {}, 'clacoform'),
  [CHOICE_SEARCH]: trans('search_mode', {}, 'clacoform'),
  [CHOICE_ADD]: trans('entry_addition', {}, 'clacoform')
}

const DISPLAY_NB_ENTRIES_CHOICES = {
  [CHOICE_ALL]: trans('choice_entry_all', {}, 'clacoform'),
  [CHOICE_PUBLISHED]: trans('choice_entry_published', {}, 'clacoform'),
  [CHOICE_NONE]: trans('no')
}

const MENU_POSITION_CHOICES = {
  [CHOICE_DOWN]: trans('choice_menu_position_down', {}, 'clacoform'),
  [CHOICE_UP]: trans('choice_menu_position_up', {}, 'clacoform'),
  [CHOICE_BOTH]: trans('both', {}, 'clacoform')
}

const DISPLAY_METADATA_CHOICES = {
  [CHOICE_ALL]: trans('yes'),
  [CHOICE_NONE]: trans('no'),
  [CHOICE_MANAGER]: trans('choice_manager_only', {}, 'clacoform')
}

const LOCKED_FIELDS_FOR_CHOICES = {
  [CHOICE_USER]: trans('choice_user_only', {}, 'clacoform'),
  [CHOICE_MANAGER]: trans('choice_manager_only', {}, 'clacoform'),
  [CHOICE_ALL]: trans('both', {}, 'clacoform')
}

const MODERATE_COMMENTS_CHOICES = {
  [CHOICE_ALL]: trans('yes'),
  [CHOICE_NONE]: trans('no'),
  [CHOICE_ANONYMOUS]: trans('choice_anonymous_comments_only', {}, 'clacoform')
}

const DISPLAY_MODES_CHOICES = {}
Object.keys(listConstants.DISPLAY_MODES).forEach(key => DISPLAY_MODES_CHOICES[key] = listConstants.DISPLAY_MODES[key].label)

export const constants = {
  FIELD_TYPES,
  FILE_TYPES,
  ENTRY_STATUS_PENDING,
  ENTRY_STATUS_PUBLISHED,
  ENTRY_STATUS_UNPUBLISHED,
  DEFAULT_HOME_CHOICES,
  DISPLAY_NB_ENTRIES_CHOICES,
  MENU_POSITION_CHOICES,
  DISPLAY_METADATA_CHOICES,
  LOCKED_FIELDS_FOR_CHOICES,
  MODERATE_COMMENTS_CHOICES,
  DISPLAY_MODES_CHOICES
}