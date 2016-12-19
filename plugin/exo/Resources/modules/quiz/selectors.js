const empty = state => state.quiz.steps.length === 0
const id = state => state.quiz.id
const description = state => state.quiz.description
const parameters = state => state.quiz.parameters
const title = state => state.quiz.title
const created = state => state.quiz.meta.created
const published = state => state.quiz.meta.published

// TODO: update when data is available
const editable = () => true

export default {
  id,
  empty,
  editable,
  created,
  description,
  parameters,
  title,
  published
}
