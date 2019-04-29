import {createSelector} from 'reselect'
import get from 'lodash/get'

const STORE_NAME = 'resource'

/**
 * Gets the whole quiz store object.
 *
 * @type {object}
 */
const resource = (state) => state[STORE_NAME]

/**
 * Gets the full quiz data.
 *
 * @type {object}
 */
const quiz = createSelector(
  [resource],
  (resource) => resource.quiz
)

/**
 * Gets the quiz id.
 *
 * @type {object}
 */
const id = createSelector(
  [quiz],
  (quiz) => quiz.id
)

const showStatistics = createSelector(
  [quiz],
  (quiz) => get(quiz, 'parameters.showStatistics') || false
)

// TODO
const hasScore = createSelector(
  [quiz],
  (quiz) => true
)

export const selectors = {
  STORE_NAME,

  resource,
  quiz,
  id,
  showStatistics,
  hasScore
}
