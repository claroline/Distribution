const empty = state => state.quiz.steps.length === 0
const description = state => state.quiz.description
const parameters = state => state.quiz.parameters
const title = state => state.quiz.title
const currentSection = () => 'editor'

// TODO: update when data is available
const editable = () => true
const created = () => '2015/12/03'
const published = () => false

export default {
  empty,
  editable,
  created,
  description,
  parameters,
  title,
  currentSection,
  published
}
