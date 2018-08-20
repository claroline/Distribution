import invariant from 'invariant'

import {url} from '#/main/app/api'
import {makeInstanceAction, makeInstanceActionCreator} from '#/main/app/store/actions'

import {API_REQUEST} from '#/main/app/api'
import {select as listSelect} from '#/main/app/content/list/store/selectors'

export const actions = {}

// filters
export const LIST_FILTER_ADD    = 'LIST_FILTER_ADD'
export const LIST_FILTER_REMOVE = 'LIST_FILTER_REMOVE'

actions.addFilter = (listName, property, value, locked = false) => {
  invariant(property, 'property is required.')
  invariant(value, 'value is required.')

  return ({
    type: makeInstanceAction(LIST_FILTER_ADD, listName),
    property,
    value,
    locked
  })
}
actions.removeFilter = makeInstanceActionCreator(LIST_FILTER_REMOVE, 'filter')


// sorting
export const LIST_SORT_UPDATE = 'LIST_SORT_UPDATE'
export const LIST_SORT_DIRECTION_UPDATE = 'LIST_SORT_DIRECTION_UPDATE'

actions.updateSort = makeInstanceActionCreator(LIST_SORT_UPDATE, 'property')
actions.updateSortDirection = makeInstanceActionCreator(LIST_SORT_DIRECTION_UPDATE, 'direction')

// selection
export const LIST_RESET_SELECT      = 'LIST_RESET_SELECT'
export const LIST_TOGGLE_SELECT     = 'LIST_TOGGLE_SELECT'
export const LIST_TOGGLE_SELECT_ALL = 'LIST_TOGGLE_SELECT_ALL'

actions.resetSelect     = makeInstanceActionCreator(LIST_RESET_SELECT)
actions.toggleSelect    = makeInstanceActionCreator(LIST_TOGGLE_SELECT, 'row', 'selected')
actions.toggleSelectAll = makeInstanceActionCreator(LIST_TOGGLE_SELECT_ALL, 'rows')


// data loading
export const LIST_DATA_LOAD       = 'LIST_DATA_LOAD'
export const LIST_DATA_INVALIDATE = 'LIST_DATA_INVALIDATE'

actions.loadData = makeInstanceActionCreator(LIST_DATA_LOAD, 'data', 'total')
actions.invalidateData = makeInstanceActionCreator(LIST_DATA_INVALIDATE)
actions.fetchData = (listName, target) => (dispatch, getState) => {
  const listState = listSelect.list(getState(), listName)

  // todo use ACTION_REFRESH type if we reload because of invalidation

  return dispatch({
    [API_REQUEST]: {
      url: url(target) + listSelect.queryString(listState),
      success: (response, dispatch) => {
        if (listSelect.currentPage(listState) !== response.page) {
          // we reset current page because if we request a non existing page,
          // finder will return us the last existing one
          dispatch(actions.changePage(listName, response.page))
        }

        dispatch(actions.loadData(listName, response.data, response.totalResults))
      }
    }
  })
}


// data delete
export const LIST_DATA_DELETE = 'LIST_DATA_DELETE'

actions.deleteItems = makeInstanceActionCreator(LIST_DATA_DELETE, 'items')
actions.deleteData = (listName, target, items) => ({
  [API_REQUEST]: {
    url: url(target, {ids: items.map(item => item.id)}),
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => {
      dispatch(actions.deleteItems(listName, items))
      dispatch(actions.invalidateData(listName))
    }
  }
})


// pagination
export const LIST_PAGE_SIZE_UPDATE = 'LIST_PAGE_SIZE_UPDATE'
export const LIST_PAGE_CHANGE      = 'LIST_PAGE_CHANGE'

actions.changePage     = makeInstanceActionCreator(LIST_PAGE_CHANGE, 'page')
actions.updatePageSize = makeInstanceActionCreator(LIST_PAGE_SIZE_UPDATE, 'pageSize')
