import {trans} from '#/main/core/translation'

const SORT_DISPLAY_OLDER_TO_NEWER = 'older_to_newer'
const SORT_DISPLAY_NEWER_TO_OLDER= 'newer_to_older'

const MESSAGE_SORT_DISPLAY = {
  [SORT_DISPLAY_OLDER_TO_NEWER]:    trans('from_older_to_newer', {}, 'forum'),
  [SORT_DISPLAY_NEWER_TO_OLDER]: trans('from_newer_to_older', {}, 'forum')
}

export const constants = {
  MESSAGE_SORT_DISPLAY
}
