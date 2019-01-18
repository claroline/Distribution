import {PAPERS_INIT, PAPER_CURRENT, PAPER_ADD, PAPER_REMOVE, PAPER_FETCHED} from './actions'
import {update} from '../../utils/utils'
import {utils} from './utils'
import cloneDeep from 'lodash/cloneDeep'

export const reducePapers = (state = {papers: {}, isFetched: false}, action = {}) => {

  switch (action.type) {
    case PAPERS_INIT: {
      return Object.assign({}, state, {
        papers: Object.assign({}, state.papers, action.papers)
      })
    }
    case PAPER_CURRENT:
      return Object.assign({}, state, {
        current: action.id
      })
    case PAPER_ADD: {
      const paper = !action.paper.score ?
        update(action.paper, {score: {$set: utils.computeScore(action.paper, action.paper.answers)}}):
        action.paper
      return Object.assign({}, state, {
        papers: update(state.papers, {[paper.id]:{$set: paper}})
      })
    }
    case PAPER_REMOVE: {
      const data = cloneDeep(state.papers)
      delete data[action.paper.paperId]
      return Object.assign({}, state, {
        papers: data
      })
    }
    case PAPER_FETCHED:
      return Object.assign({}, state, {
        isFetched: true
      })
  }

  return state
}
