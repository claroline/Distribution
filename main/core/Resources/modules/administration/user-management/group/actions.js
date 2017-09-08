import {makeActionCreator} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'

import {actions as listActions} from '#/main/core/layout/list/actions'
import {select as listSelect} from '#/main/core/layout/list/selectors'
import {select as paginationSelect} from '#/main/core/layout/pagination/selectors'

import {REQUEST_SEND} from '#/main/core/api/actions'

export const GROUPS_LOAD = 'GROUPS_LOAD'

export const actions = {}

actions.loadGroups = makeActionCreator(GROUPS_LOAD, 'GROUPS', 'total')

actions.fetchGroups = () => (dispatch, getState) => {
  const state = getState()

  const page = paginationSelect.current(state)
  const pageSize = paginationSelect.pageSize(state)
  let url = generateUrl('api_get_search_groups', {page: page, limit: pageSize}) + '?'

  // build queryString
  let queryString = ''

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
      url: url + queryString,
      request: {
        method: 'GET'
      },
      success: (data, dispatch) => {
        dispatch(listActions.resetSelect())
        dispatch(actions.loadGroups(data.results, data.total))
      }
    }
  })
}
