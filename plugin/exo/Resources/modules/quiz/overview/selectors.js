const empty = state => state.quiz.steps.length === 0
const editable = () => true
const created = state => state.quiz.meta.created
const description = state => state.quiz.description
const parameters = state => state.quiz.parameters

export default {
  empty,
  editable,
  created,
  description,
  parameters
}
