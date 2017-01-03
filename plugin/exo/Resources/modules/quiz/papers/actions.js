import invariant from 'invariant'
import {makeActionCreator} from './../../utils/utils'
import {actions as baseActions} from './../actions'
import {VIEW_PAPERS, VIEW_PAPER} from './../enums'
import {fetchPapers} from './api'
import {selectors} from './selectors'

export const PAPERS_LIST = 'PAPERS_LIST'
export const PAPERS_INIT = 'PAPERS_INIT'
export const PAPER_DISPLAY = 'PAPER_DISPLAY'
export const PAPER_CURRENT = 'PAPER_DISPLAY'

export const actions = {}

const initPapers = makeActionCreator(PAPERS_INIT, 'papers')
const setCurrentPaper = makeActionCreator(PAPER_CURRENT, 'id')

actions.displayPaper = (quizId, paperId) => {
  invariant(quizId, 'Quiz id is mandatory')
  invariant(paperId, 'Paper id is mandatory')
  return (dispatch, getState) => {
    if (!selectors.papersFetched(getState())) {
      fetchPapers(quizId).then(papers => {
        dispatch(initPapers(papers))
        dispatch(setCurrentPaper(paperId))
        dispatch(baseActions.updateViewMode(VIEW_PAPER))
      })
    } else {
      dispatch(setCurrentPaper(paperId))
      dispatch(baseActions.updateViewMode(VIEW_PAPER))
    }
  }
}

actions.listPapers = () => {
  return (dispatch, getState) => {
    if (!selectors.papersFetched(getState())) {
      fetchPapers(selectors.quizId(getState())).then(papers => {
        dispatch(initPapers(papers))
        dispatch(baseActions.updateViewMode(VIEW_PAPERS))
      })
    } else {
      dispatch(baseActions.updateViewMode(VIEW_PAPERS))
    }
  }
}
