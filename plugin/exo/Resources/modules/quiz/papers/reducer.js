import {PAPERS_INIT, PAPER_CURRENT, PAPER_UPDATE} from './actions'
import {ATTEMPT_FINISH} from './../player/actions'
import {fetchPapers} from './api'

export const reducePapers = (state = {}, action = {}) => {
  switch (action.type) {
    case PAPERS_INIT:
      return Object.assign({}, state, {
        papers: action.papers
      })
    case PAPER_CURRENT:
      return Object.assign({}, state, {
        current: action.id
      })
    case PAPER_UPDATE:
      if (state.papers) {
        let found = false
        let papers = state.papers.map(p => {
          if (p.id === action.paper.id) {
            found = true
            return action.paper
          } else {
            return p
          }
        })
        if (!found) {
          papers.push(action.paper)
        }
        return Object.assign({}, state, {
          papers: papers
        })
      }
  }

  return state
}
