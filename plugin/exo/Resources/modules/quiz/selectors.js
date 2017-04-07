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
const published = state => state.quiz.meta.published
const viewMode = state => state.viewMode
const editable = state => state.quiz.meta.editable
const hasPapers = state => state.quiz.meta.paperCount > 0 || (state.papers.papers && state.papers.papers.length > 0)
const hasUserPapers = state => state.quiz.meta.userPaperCount > 0
const papersAdmin = state => state.quiz.meta.canViewPapers
const registered = state => state.quiz.meta.registered
const saveEnabled = state => !state.editor.saved && !state.editor.saving
const modal = state => state.modal
const editorOpened = state => state.editor.opened
const noItems = state =>
  Object.keys(state.quiz.steps).length === 1 && Object.keys(state.items).length === 0
const firstStepId = state => state.quiz.steps[0]
const hasOverview = state => state.quiz.parameters.showOverview
const testMode = state => state.quiz.testMode

export default {
  id,
  quiz,
  steps,
  items,
  empty,
  editable,
  hasPapers,
  hasUserPapers,
  papersAdmin,
  registered,
  description,
  meta,
  parameters,
  title,
  published,
  viewMode,
  isLoading,
  alerts,
  saveEnabled,
  modal,
  editorOpened,
  noItems,
  firstStepId,
  hasOverview,
  testMode
}
