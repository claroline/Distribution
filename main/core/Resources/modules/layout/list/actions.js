import get from 'lodash/get'

import {makeActionCreator} from '#/main/core/utilities/redux'

import {REQUEST_SEND} from '#/main/core/api/actions'
import {select as listSelect} from '#/main/core/layout/list/selectors'
import {getDataQueryString} from '#/main/core/layout/list/utils'

export const actions = {}

// filters
export const LIST_FILTER_ADD    = 'LIST_FILTER_ADD'
export const LIST_FILTER_REMOVE = 'LIST_FILTER_REMOVE'

actions.addFilter    = makeActionCreator(LIST_FILTER_ADD, 'listName', 'property', 'value')
actions.removeFilter = makeActionCreator(LIST_FILTER_REMOVE, 'listName', 'filter')


// sorting
export const LIST_SORT_UPDATE = 'LIST_SORT_UPDATE'

actions.updateSort = makeActionCreator(LIST_SORT_UPDATE, 'listName', 'property')


// selection
export const LIST_RESET_SELECT      = 'LIST_RESET_SELECT'
export const LIST_TOGGLE_SELECT     = 'LIST_TOGGLE_SELECT'
export const LIST_TOGGLE_SELECT_ALL = 'LIST_TOGGLE_SELECT_ALL'

actions.resetSelect     = makeActionCreator(LIST_RESET_SELECT, 'listName')
actions.toggleSelect    = makeActionCreator(LIST_TOGGLE_SELECT, 'listName', 'row')
actions.toggleSelectAll = makeActionCreator(LIST_TOGGLE_SELECT_ALL, 'listName', 'rows')


// data loading
export const LIST_DATA_LOAD = 'LIST_DATA_LOAD'

//data delete
export const LIST_DATA_DELETE = 'LIST_DATA_DELETE'

actions.loadData = makeActionCreator(LIST_DATA_LOAD, 'listName', 'data', 'total')

actions.asyncDeleteItems = (listName, items) => (dispatch, getState) => {
  const listState = get(getState(), listName)

  dispatch({
    [REQUEST_SEND]: {
      url: listSelect.deleteUrl(listState) + getDataQueryString(items),
      request: {
        method: 'DELETE'
      },
      success: (data, dispatch) => {
        dispatch(actions.changePage(listName, 0))
        dispatch(actions.fetchData(listName))
      }
    }
  })
}

actions.fetchData = (listName) => (dispatch, getState) => {
  const listState = get(getState(), listName)

  dispatch({
    [REQUEST_SEND]: {
      url: listSelect.fetchUrl(listState) + listSelect.queryString(listState),
      request: {
        method: 'GET'
      },
      success: (response, dispatch) => {
        dispatch(actions.resetSelect(listName))
        dispatch(actions.loadData(listName, response.data, response.totalResults))
      }
    }
  })
}


// pagination
export const LIST_PAGE_SIZE_UPDATE = 'LIST_PAGE_SIZE_UPDATE'
export const LIST_PAGE_CHANGE      = 'LIST_PAGE_CHANGE'

actions.deleteItems    = makeActionCreator(LIST_DATA_DELETE, 'listName', 'items')
actions.changePage     = makeActionCreator(LIST_PAGE_CHANGE, 'listName', 'page')
actions.updatePageSize = makeActionCreator(LIST_PAGE_SIZE_UPDATE, 'listName', 'pageSize')
