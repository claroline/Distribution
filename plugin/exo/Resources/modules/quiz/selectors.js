// TODO : use reselect
// TODO : there is possible code refactoring with editor/selectors.js

const isLoading = state => state.currentRequests > 0
const alerts = state => state.alerts
const empty = state => state.quiz.steps.length === 0
const quiz = state => state.quiz
const steps = state => state.steps
const items = state => state.items
const id = state => state.quiz.id
const description = state => state.quiz.description
const parameters = state => state.quiz.parameters
const title = state => state.quiz.title
const meta = state => state.quiz.meta
const viewMode = state => state.viewMode
const hasPapers = state => state.quiz.meta.paperCount > 0 || (state.papers.papers && state.papers.papers.length > 0)
const saveEnabled = state => !state.editor.saved && !state.editor.saving
const editorOpened = state => state.editor.opened
const noItems = state =>
  Object.keys(state.quiz.steps).length === 1 && Object.keys(state.items).length === 0
const firstStepId = state => state.quiz.steps[0]
const hasOverview = state => state.quiz.parameters.showOverview

export default {
  id,
  quiz,
  steps,
  items,
  empty,
  hasPapers,
  description,
  meta,
  parameters,
  title,
  viewMode,
  isLoading,
  alerts,
  saveEnabled,
  editorOpened,
  noItems,
  firstStepId,
  hasOverview
}
