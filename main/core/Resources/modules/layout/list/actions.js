import get from 'lodash/get'

import {makeInstanceActionCreator} from '#/main/core/utilities/redux'

import {REQUEST_SEND} from '#/main/core/api/actions'
import {select as listSelect} from '#/main/core/layout/list/selectors'
import {getDataQueryString} from '#/main/core/layout/list/utils'

export const actions = {}

// filters
export const LIST_FILTER_ADD    = 'LIST_FILTER_ADD'
export const LIST_FILTER_REMOVE = 'LIST_FILTER_REMOVE'

actions.addFilter    = makeInstanceActionCreator(LIST_FILTER_ADD, 'property', 'value')
actions.removeFilter = makeInstanceActionCreator(LIST_FILTER_REMOVE, 'filter')


// sorting
export const LIST_SORT_UPDATE = 'LIST_SORT_UPDATE'

actions.updateSort = makeInstanceActionCreator(LIST_SORT_UPDATE, 'property')


// selection
export const LIST_RESET_SELECT      = 'LIST_RESET_SELECT'
export const LIST_TOGGLE_SELECT     = 'LIST_TOGGLE_SELECT'
export const LIST_TOGGLE_SELECT_ALL = 'LIST_TOGGLE_SELECT_ALL'

actions.resetSelect     = makeInstanceActionCreator(LIST_RESET_SELECT)
actions.toggleSelect    = makeInstanceActionCreator(LIST_TOGGLE_SELECT, 'row')
actions.toggleSelectAll = makeInstanceActionCreator(LIST_TOGGLE_SELECT_ALL, 'rows')


// data loading
export const LIST_DATA_LOAD = 'LIST_DATA_LOAD'

//data delete
export const LIST_DATA_DELETE = 'LIST_DATA_DELETE'

actions.loadData = makeInstanceActionCreator(LIST_DATA_LOAD, 'data', 'total')

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

actions.fetchData = (listName, url) => (dispatch, getState) => {
  const listState = get(getState(), listName)

  dispatch({
    [REQUEST_SEND]: {
      url: url + listSelect.queryString(listState),
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

actions.deleteItems    = makeInstanceActionCreator(LIST_DATA_DELETE, 'items')
actions.changePage     = makeInstanceActionCreator(LIST_PAGE_CHANGE, 'page')
actions.updatePageSize = makeInstanceActionCreator(LIST_PAGE_SIZE_UPDATE, 'pageSize')
