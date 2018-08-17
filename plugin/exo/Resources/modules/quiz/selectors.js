import {createSelector} from 'reselect'

import {currentUser} from '#/main/core/user/current'
import {selectors as resourceSelect} from '#/main/core/resource/store'
import {hasPermission} from '#/main/core/resource/permissions'

// TODO : there is possible code refactoring with editor/selectors.js

const STORE_NAME = 'resource'

const registered = () => null !== currentUser()

const resource = (state) => state[STORE_NAME]

const steps = createSelector(
  resource,
  (resource) => resource.steps
)
const items = createSelector(
  resource,
  (resource) => resource.items
)

const viewMode = createSelector(
  resource,
  (resource) => resource.viewMode
)

const quiz = createSelector(
  resource,
  (resource) => resource.quiz
)

const id = createSelector(
  quiz,
  (quiz) => quiz.id
)

const testMode = createSelector(
  quiz,
  (quiz) => quiz.testMode || false
)

const quizSteps = createSelector(
  quiz,
  (quiz) => quiz.steps || []
)

const empty = createSelector(
  quizSteps,
  (quizSteps) => quizSteps.length === 0
)

const description = createSelector(
  quiz,
  (quiz) => quiz.description
)

const parameters = createSelector(
  quiz,
  (quiz) => quiz.parameters
)

const title = createSelector(
  quiz,
  (quiz) => quiz.title
)

const meta = createSelector(
  quiz,
  (quiz) => quiz.meta
)


const hasPapers = state => state.quiz.meta.paperCount > 0 || (state.papers.papers && state.papers.papers.length > 0)
const hasUserPapers = state => state.quiz.meta.userPaperCount > 0

const noItems = state => Object.keys(state.quiz.steps).length === 1 && Object.keys(state.items).length === 0
const firstStepId = state => state.quiz.steps[0]
const hasOverview = state => state.quiz.parameters.showOverview

const papersShowExpectedAnswers = state => state.quiz.parameters.showFullCorrection
const papersShowStatistics = state => state.quiz.parameters.showStatistics
const allPapersStatistics = state => state.quiz.parameters.allPapersStatistics

const quizNumbering = createSelector(
  parameters,
  (parameters) => parameters.numbering
)

const papersAdmin = createSelector(
  [resourceSelect.resourceNode],
  (resourceNode) => hasPermission('manage_papers', resourceNode)
)

const docimologyAdmin = createSelector(
  [resourceSelect.resourceNode],
  (resourceNode) => hasPermission('view_docimology', resourceNode)
)

// TODO : remove default export and use named one
export default {
  STORE_NAME,
  resource,
  id,
  quiz,
  steps,
  items,
  empty,
  hasPapers,
  hasUserPapers,
  papersAdmin,
  docimologyAdmin,
  registered,
  description,
  meta,
  parameters,
  title,
  viewMode,
  noItems,
  firstStepId,
  hasOverview,
  testMode,
  quizNumbering,
  papersShowExpectedAnswers,
  papersShowStatistics,
  allPapersStatistics
}

export const select = {
  STORE_NAME,
  resource,
  id,
  quiz,
  steps,
  items,
  empty,
  hasPapers,
  hasUserPapers,
  papersAdmin,
  docimologyAdmin,
  registered,
  description,
  meta,
  parameters,
  title,
  viewMode,
  noItems,
  firstStepId,
  hasOverview,
  testMode,
  quizNumbering,
  papersShowExpectedAnswers,
  papersShowStatistics,
  allPapersStatistics
}
