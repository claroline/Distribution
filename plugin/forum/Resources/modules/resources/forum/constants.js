import {trans} from '#/main/core/translation'

const SORT_DISPLAY_OLDER_TO_NEWER = 'older_to_newer'
const SORT_DISPLAY_NEWER_TO_OLDER= 'newer_to_older'
const DISPLAY_TABLE_SM= 'table-sm'
const DISPLAY_TABLE= 'table'
const DISPLAY_LIST_SM= 'list-sm'
const DISPLAY_LIST= 'list'

const MESSAGE_SORT_DISPLAY = {
  [SORT_DISPLAY_OLDER_TO_NEWER]: trans('from_older_to_newer', {}, 'forum'),
  [SORT_DISPLAY_NEWER_TO_OLDER]: trans('from_newer_to_older', {}, 'forum')
}

const LIST_DISPLAY_MODES = {
  [DISPLAY_TABLE_SM]: trans('list_display_table_sm'),
  [DISPLAY_TABLE]: trans('list_display_table'),
  [DISPLAY_LIST_SM]: trans('list_display_list_sm'),
  [DISPLAY_LIST]: trans('list_display_list')
}

export const constants = {
  MESSAGE_SORT_DISPLAY,
  LIST_DISPLAY_MODES
}
