import {makeActionCreator} from '#/main/core/utilities/redux'

import {REQUEST_SEND} from './../../api/actions'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {actions as questionActions} from './questions'
import {actions as totalResultsActions} from './total-results'

import {actions as listActions} from '#/main/core/layout/list/actions'
import {select as listSelect} from '#/main/core/layout/list/selectors'

import {generateUrl} from '#/main/core/fos-js-router'

export const SEARCH_CLEAR_FILTERS  = 'SEARCH_CLEAR_FILTERS'
export const SEARCH_CHANGE_FILTERS = 'SEARCH_CHANGE_FILTERS'

export const actions = {}

actions.fetchQuestions = () => (dispatch, getState) => {
  const state = getState()
  const page = 0
  const pageSize = 20

  // build queryString
  let queryString = ''

  let url = generateUrl('get_search_items', {page: page, limit: pageSize}) + '?'

  // add filters
  const filters = listSelect.filters(state)
  if (0 < filters.length) {
    queryString += filters.map(filter => {
      let value = filter.value.constructor.name === 'Moment' ?  filter.value.unix(): filter.value
      return `filters[${filter.property}]=${value}`
    }).join('&')
  }

  // add sort by
  const sortBy = listSelect.sortBy(state)
  if (sortBy.property && 0 !== sortBy.direction) {
    queryString += `${0 < queryString.length ? '&':''}sortBy=${-1 === sortBy.direction ? '-':''}${sortBy.property}`
  }

  dispatch({
    [REQUEST_SEND]: {
      url: url,
      request: {
        method: 'GET'
      },
      success: (data, dispatch) => {
        dispatch(listActions.resetSelect())
        // Update total results
        dispatch(totalResultsActions.changeTotalResults(data.searchResults.totalResults))
        // Update questions list
        dispatch(questionActions.setQuestions(data.searchResults.questions))
      }
    }
  })
}

actions.changeFilters = makeActionCreator(SEARCH_CHANGE_FILTERS, 'filters')

actions.search = (filters, pagination = {}, sortBy = {}) => {
  return (dispatch) => {
    // Close search modal
    dispatch(modalActions.fadeModal())

    // Update filters
    dispatch(actions.changeFilters(filters))

    // Fetch new questions list
    return dispatch(actions.fetchQuestions(filters, pagination, sortBy))
  }
}

actions.clearFilters = (pagination = {}, sortBy = {}) => {
  return (dispatch) => {
    // Close search modal
    dispatch(modalActions.fadeModal())

    // Update filters
    dispatch(actions.changeFilters({}))

    // Fetch new questions list
    return dispatch(actions.fetchQuestions({}, pagination, sortBy))
  }
}
