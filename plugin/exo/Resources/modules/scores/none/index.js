import {trans} from '#/main/app/intl/translation'

const SCORE_NONE = 'none'

export default {
  name: SCORE_NONE,
  meta: {
    label: trans('score_none', {}, 'quiz'),
    description: trans('score_none_desc', {}, 'quiz')
  },

  // there is nothing to do for this type
  configure: () => [],
  calculate: () => undefined,
  calculateTotal: () => undefined
}
