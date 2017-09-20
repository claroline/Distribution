import {makeReducer} from '#/main/core/utilities/redux'
import {update} from './../../utils/utils'

import {
  LIST_PAGE_CHANGE,
  LIST_PAGE_SIZE_UPDATE
} from '#/main/core/layout/list/actions'

function changePage(paginationState, action = {}) {
  return update(paginationState, {page: {$set: action.page}})
}

function updatePageSize(paginationState, action = {}) {
  // TODO : manage the case when the current page no longer exists
  return update(paginationState, {pageSize: {$set: action.pageSize}})
}

const paginationReducer = makeReducer({
  current: 0,
  pageSize: 10
}, {
  [LIST_PAGE_CHANGE]: changePage,
  [LIST_PAGE_SIZE_UPDATE]: updatePageSize
})

export default paginationReducer
