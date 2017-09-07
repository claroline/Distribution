import invariant from 'invariant'

import {makeActionCreator} from '#/main/core/utilities/redux'
import {navigate} from './../router'
import {actions as baseActions} from './../actions'
import {VIEW_PAPERS, VIEW_PAPER} from './../enums'
import {selectors} from './selectors'
import quizSelectors from './../selectors'
import {normalize} from './normalizer'
import {REQUEST_SEND} from './../../api/actions'
import quizSelectors from './../selectors'
import {generateUrl} from '#/main/core/fos-js-router'
import {select as listSelect} from '#/main/core/layout/list/selectors'
import {select as paginationSelect} from '#/main/core/layout/pagination/selectors'

export const PAPER_ADD = 'PAPER_ADD'
export const PAPERS_LIST = 'PAPERS_LIST'
export const PAPERS_INIT = 'PAPERS_INIT'
export const PAPERS_RELOAD = 'PAPERS_RELOAD'
export const PAPER_DISPLAY = 'PAPER_DISPLAY'
export const PAPER_CURRENT = 'PAPER_DISPLAY'
export const PAPER_FETCHED = 'PAPER_FETCHED'

export const actions = {}

const initPapers = makeActionCreator(PAPERS_INIT, 'papers')
const reloadPapers = makeActionCreator(PAPERS_RELOAD, 'papers', 'total')
const setPaperFetched = makeActionCreator(PAPER_FETCHED)
actions.setCurrentPaper = makeActionCreator(PAPER_CURRENT, 'id')
actions.addPaper = makeActionCreator(PAPER_ADD, 'paper')

actions.fetchPapers = quizId => ({
  [REQUEST_SEND]: {
    route: ['exercise_papers', {exerciseId: quizId}],
    request: {method: 'GET'},
    success: (data, dispatch) => {
      dispatch(initPapers(normalize(data)))
      dispatch(setPaperFetched())
    },
    failure: () => navigate('overview')
  }
})

actions.fetchFilteredPapers = () => (dispatch, getState) => {
  const state = getState()
  const quizId = quizSelectors.id(state)
  const page = paginationSelect.current(state)
  const pageSize = paginationSelect.pageSize(state)
  const url = generateUrl('exercise_filtered_papers', {exerciseId: quizId, page: page, limit: pageSize}) + '?'

  // build queryString
  let queryString = ''

  // add filters
  const filters = listSelect.filters(state)
  if (0 < filters.length) {
    queryString += filters.map(filter => `filters[${filter.property}]=${filter.value}`).join('&')
  }

  // add sort by
  const sortBy = listSelect.sortBy(state)
  if (sortBy.property && 0 !== sortBy.direction) {
    queryString += `${0 < queryString.length ? '&':''}sortBy=${-1 === sortBy.direction ? '-':''}${sortBy.property}`
  }

  dispatch({
    [REQUEST_SEND]: {
      url: url + queryString,
      request: {
        method: 'GET'
      },
      success: (data, dispatch) => {
        dispatch(reloadPapers(normalize(data.papers), data.count))
      },
      failure: () => navigate('overview')
    }
  })
}

actions.displayPaper = id => {
  invariant(id, 'Paper id is mandatory')
  return (dispatch, getState) => {
    if (!selectors.papersFetched(getState()) && (!selectors.papers(getState())[id] || quizSelectors.papersShowStatistics(getState()))) {
      dispatch(actions.fetchPapers(selectors.quizId(getState()))).then(() => {
        dispatch(actions.setCurrentPaper(id))
        dispatch(baseActions.updateViewMode(VIEW_PAPER))
      })
    } else {
      dispatch(actions.setCurrentPaper(id))
      dispatch(baseActions.updateViewMode(VIEW_PAPER))
    }
  }
}

actions.listPapers = () => {
  return (dispatch, getState) => {
    if (!selectors.papersFetched(getState())) {
      dispatch(actions.fetchPapers(selectors.quizId(getState()))).then(() => {
        dispatch(baseActions.updateViewMode(VIEW_PAPERS))
      })
    } else {
      dispatch(baseActions.updateViewMode(VIEW_PAPERS))
    }
  }
}
