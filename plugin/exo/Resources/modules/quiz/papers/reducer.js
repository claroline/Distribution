import {PAPERS_INIT, PAPER_CURRENT, PAPER_ADD} from './actions'
import {update} from '../../utils/utils'

export const reducePapers = (state = {papers: []}, action = {}) => {
  switch (action.type) {
    case PAPERS_INIT:
      return Object.assign({}, state, {
        papers: action.papers
      })
    case PAPER_CURRENT:
      return Object.assign({}, state, {
        current: action.id
      })
    case PAPER_ADD:
      return Object.assign({}, state, {
        papers: update(state.papers, {$push: [action.paper]})
      })
  }

  return state
}
