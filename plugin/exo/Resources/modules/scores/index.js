import {getDefinition} from '#/plugin/exo/items/item-types'

import {
  RULE_TYPE_ALL,
  RULE_TYPE_MORE,
  RULE_TYPE_LESS,
  RULE_TYPE_BETWEEN,
  RULE_SOURCE_CORRECT,
  RULE_SOURCE_INCORRECT,
  RULE_TARGET_GLOBAL,
  RULE_TARGET_ANSWER
} from '#/plugin/exo/data/types/score-rules/constants'

// TODO : make dynamic registry
import ScoreFixed from '#/plugin/exo/scores/fixed'
import ScoreManual from '#/plugin/exo/scores/manual'
import ScoreNone from '#/plugin/exo/scores/none'
import ScoreRules from '#/plugin/exo/scores/rules'
import ScoreSum from '#/plugin/exo/scores/sum'

const SCORE_TYPES = {
  [ScoreNone.name]  : ScoreNone,
  [ScoreFixed.name] : ScoreFixed,
  [ScoreManual.name]: ScoreManual,
  [ScoreRules.name] : ScoreRules,
  [ScoreSum.name]   : ScoreSum
}

const DEFAULT_SCORE_TYPE = ScoreSum.name

/**
 *
 * @param {object} scoreRule
 * @param {object} correctedAnswer
 *
 * @return {number}
 */
function calculateScore(scoreRule, correctedAnswer) {
  const currentScore = SCORE_TYPES[scoreRule.type]
  if (currentScore) {
    let score = currentScore.calculate(scoreRule, correctedAnswer)
    if (null !== score) {
      score = correctedAnswer.getPenalties().reduce((score, penalty) => score - penalty, score)
    }

    return score
  }

  return null
}

/**
 *
 * @param {object} item
 *
 * @return {number}
 */
function calculateTotal(item) {
  const rulesData = {
    nbChoices: 0,
    max: {
      [RULE_SOURCE_CORRECT]: 0,
      [RULE_SOURCE_INCORRECT]: 0
    }
  }
  let scoreMax
  let score = 0

  if (item && item.score) {
    switch (item.score.type) {
      case 'manual':
        scoreMax = item.score.max
        break

      case 'fixed':
        scoreMax = item.score.success
        break

      case 'sum':
        scoreMax = getDefinition(item.type).correctAnswer(item).getMissing().reduce((sum, el) => sum += el.getScore(), 0)
        break

      case 'rules':
        rulesData.nbChoices = item.choices ? item.choices.length : 0

        // compute best score by source
        item.score.rules.forEach(rule => {
          score = 0

          switch (rule.type) {
            case RULE_TYPE_ALL:
              score = rule.target === RULE_TARGET_GLOBAL ?
                rule.points :
                rule.points * rulesData.nbChoices
              break
            case RULE_TYPE_MORE:
              if (rule.target === RULE_TARGET_GLOBAL) {
                score = rule.count <= rulesData.nbChoices ? rule.points : 0
              } else {
                score = rule.count <= rulesData.nbChoices ? rule.points * rulesData.nbChoices : 0
              }
              break
            case RULE_TYPE_LESS:
              if (rule.target === RULE_TARGET_GLOBAL) {
                score = rule.count > 0 ? rule.points : 0
              } else {
                if (rule.count <= rulesData.nbChoices && rule.count > 0) {
                  score = rule.points * (rule.count - 1)
                } else if (rule.count > rulesData.nbChoices) {
                  score = rule.points * rulesData.nbChoices
                }
              }
              break
            case RULE_TYPE_BETWEEN:
              if (rule.target === RULE_TARGET_GLOBAL) {
                score = rule.countMin <= rulesData.nbChoices ? rule.points : 0
              } else {
                if (rule.countMax <= rulesData.nbChoices) {
                  score = rule.points * rule.countMax
                } else if (rule.countMin <= rulesData.nbChoices && rule.countMax >= rulesData.nbChoices) {
                  score = rule.points * rulesData.nbChoices
                }
              }
              break
          }
          if (score > rulesData.max[rule.source]) {
            rulesData.max[rule.source] = score
          }
        })
        scoreMax = rulesData.max[RULE_SOURCE_CORRECT] >= rulesData.max[RULE_SOURCE_INCORRECT] ?
          rulesData.max[RULE_SOURCE_CORRECT] :
          rulesData.max[RULE_SOURCE_INCORRECT]
        break

      case 'none':
      default:
        scoreMax = undefined
        break
    }
  }

  return scoreMax
}

export {
  SCORE_TYPES,
  DEFAULT_SCORE_TYPE,
  calculateScore,
  calculateTotal
}
