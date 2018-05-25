import cloneDeep from 'lodash/cloneDeep'

import {combineReducers, makeReducer} from '#/main/core/scaffolding/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

import {update} from '#/plugin/exo/utils/utils'
import {PAPERS_INIT, PAPER_CURRENT, PAPER_ADD, PAPER_FETCHED} from '#/plugin/exo/quiz/papers/actions'
import {utils} from '#/plugin/exo/quiz/papers/utils'

const reducer = combineReducers({
  list: makeListReducer('papers.list', {}),
  papers: makeReducer({}, {
    [PAPERS_INIT]: (state, action) => action.papers,
    [PAPER_ADD]: (state, action) => {
      const newState = cloneDeep(state)
      const paper = !action.paper.score ?
        update(action.paper, {score: {$set: utils.computeScore(action.paper, action.paper.answers)}}):
        action.paper

      update(newState, {[paper.id]:{$set: paper}})

      return newState
    }
  })
})

export {
  reducer
}

// export const reducePapers = (state = {papers: {}, isFetched: false}, action = {}) => {
//
//   switch (action.type) {
//     case PAPERS_INIT: {
//       return Object.assign({}, state, {
//         papers: Object.assign({}, state.papers, action.papers)
//       })
//     }
//     case PAPER_CURRENT:
//       return Object.assign({}, state, {
//         current: action.id
//       })
//     case PAPER_ADD: {
//       const paper = !action.paper.score ?
//         update(action.paper, {score: {$set: utils.computeScore(action.paper, action.paper.answers)}}):
//         action.paper
//       return Object.assign({}, state, {
//         papers: update(state.papers, {[paper.id]:{$set: paper}})
//       })
//     }
//     case PAPER_FETCHED:
//       return Object.assign({}, state, {
//         isFetched: true
//       })
//   }
//
//   return state
// }
