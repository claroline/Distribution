import {trans} from '#/main/app/intl/translation'

const SCORE_SUM = 'sum'

export default {
  name: SCORE_SUM,
  meta: {
    label: trans('score_sum', {}, 'quiz'),
    description: trans('score_sum_desc', {}, 'quiz')
  },

  // no additional configuration
  configure: () => [],

  calculate: (scoreRule, correctedAnswer) => {
    let score = 0

    correctedAnswer.getExpected().forEach(el => score += el.getScore())
    correctedAnswer.getUnexpected().forEach(el => score += el.getScore())

    correctedAnswer.getPenalties().forEach(el => score -= el.getScore())

    return score
  }
}
