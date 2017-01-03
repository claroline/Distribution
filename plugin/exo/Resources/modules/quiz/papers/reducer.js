import {PAPERS_INIT, PAPER_CURRENT} from './actions'

export const reducePapers = (state = {}, action = {}) => {
  switch (action.type) {
    case PAPERS_INIT:
      return action.papers
    case PAPER_CURRENT:
      return Object.assign({}, state, {
        current: action.id
      })
  }

  return state
}
