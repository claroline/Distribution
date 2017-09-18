import {makeReducer} from '#/main/core/utilities/redux'

import {constants} from '#/main/core/layout/pagination/constants'
import {
  PAGE_CHANGE,
  PAGE_SIZE_UPDATE
} from '#/main/core/layout/pagination/actions'

const defaultState = {
  current: 0,
  pageSize: constants.DEFAULT_PAGE_SIZE
}

const reducer = makeReducer(defaultState, {
  /**
   * Changes the current page.
   *
   * @param {Object} state
   * @param {Object} action
   *
   * @returns {Object}
   */
  [PAGE_CHANGE]: (state, action = {}) => Object.assign({}, state, {current: action.page}),

  /**
   * Changes the page size.
   *
   * @param {Object} state
   * @param {Object} action
   *
   * @returns {Object}
   */
  [PAGE_SIZE_UPDATE]: (state, action = {}) => {
    return {
      current: 0, // todo : find a better way to handle this
      pageSize: action.pageSize
    }
  }
})

export {
  reducer
}
