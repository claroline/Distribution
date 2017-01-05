import {createSelector} from 'reselect'

const quizId = state => state.quiz.id
const papers = state => state.papers.papers
const papersFetched = state => !!state.papers.papers
const currentPaperId = state => state.papers.current
const items = state => state.papers.questions

const currentPaper = createSelector(
  papers,
  currentPaperId,
  items,
  (papers, currentId, items) => {
    const paper = papers.find(paper => paper.id === currentId)
    const denormalized = Object.assign({}, paper)
    denormalized.steps = paper.structure.map(step => ({
      items: step.items.map(id => items.find(item => item.id === id))
    }))
    return denormalized
  }
)

export const selectors = {
  quizId,
  papers,
  papersFetched,
  currentPaper
}
