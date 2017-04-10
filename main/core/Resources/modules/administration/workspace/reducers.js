import {makeReducer} from '#/main/core/react/store/reducer'

export const CHANGE_PAGE = 'CHANGE_PAGE'

function changePage(state) {
  return state
}

export const reducers = {
  pager: makeReducer(0, {
    [CHANGE_PAGE]: changePage
  })
}
