import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'

import {makeResourceReducer} from '#/main/core/resource/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {combineReducers, makeReducer} from '#/main/core/scaffolding/reducer'

import {validate} from './validator'
import {
  ANNOUNCE_DETAIL_OPEN,
  ANNOUNCE_DETAIL_RESET,
  ANNOUNCE_FORM_OPEN,
  ANNOUNCE_FORM_RESET,
  ANNOUNCE_FORM_UPDATE,
  ANNOUNCE_FORM_VALIDATE,
  ANNOUNCE_ADD,
  ANNOUNCE_DELETE,
  ANNOUNCE_CHANGE,
  ANNOUNCES_SORT_TOGGLE,
  ANNOUNCES_PAGE_CHANGE
} from './actions'

/**
 * Manages announcement posts sort (posts can only be ordered by date).
 * NB. 1 is for ASC, -1 is for DESC
 */
const sortReducer = makeReducer(-1, {
  [ANNOUNCES_SORT_TOGGLE]: (state) => 0-state
})

/**
 * Manages announcement pagination.
 */
const pageReducer = makeReducer(0, {
  [ANNOUNCES_PAGE_CHANGE]: (state, action) => action.page
})

/**
 * Manages announcements post CRUD actions.
 */
const announcementReducer = makeReducer({posts: []}, {
  [ANNOUNCE_ADD]: (state, action) => {
    const newState = cloneDeep(state)

    // add new announce to the list
    newState.posts.push(action.announce)

    return newState
  },
  [ANNOUNCE_CHANGE]: (state, action) => {
    const newState = cloneDeep(state)

    // update announce in the list
    const announcePos = newState.posts.findIndex(post => post.id === action.announce.id)

    if (announcePos > -1) {
      newState.posts[announcePos] = action.announce
    }

    return newState
  },
  [ANNOUNCE_DELETE]: (state, action) => {
    const newState = cloneDeep(state)

    // delete announce form the list
    newState.posts.splice(
      newState.posts.findIndex(post => post.id === action.announce.id),
      1
    )

    return newState
  }
})

const announcementFormReducer = makeReducer({
  validating: false,
  pendingChanges: false,
  errors: {},
  data: null
}, {
  [ANNOUNCE_FORM_VALIDATE]: (state) => ({
    validating: true,
    pendingChanges: state.pendingChanges,
    errors: validate(state.data),
    data: state.data
  }),
  [ANNOUNCE_FORM_RESET]: () => ({
    validating: false,
    pendingChanges: false,
    errors: {},
    data: null
  }),
  [ANNOUNCE_FORM_OPEN]: (state, action) => ({
    validating: false,
    pendingChanges: false,
    errors: validate(action.announce),
    data: action.announce
  }),
  [ANNOUNCE_FORM_UPDATE]: (state, action) => {
    const newData = cloneDeep(state.data)
    set(newData, action.prop, action.value)

    return {
      validating: false,
      pendingChanges: true,
      errors: validate(newData),
      data: newData
    }
  }
})

const announcementDetailReducer = makeReducer(null, {
  [ANNOUNCE_DETAIL_OPEN]: (state, action) => action.announceId,
  [ANNOUNCE_DETAIL_RESET]: () => null
})

const reducer = makeResourceReducer({}, {
  currentPage: pageReducer,
  sortOrder: sortReducer,
  announcement: announcementReducer,

  announcementForm: announcementFormReducer,
  announcementDetail: announcementDetailReducer,

  selected: combineReducers({

    list: makeListReducer(
      'selected.list',
      {},
      {
        invalidated: makeReducer(false, {
          ['MODAL_HIDE']: () => true // todo : find better
        })
      },
      {selectable: false, filterable: true, readOnly: true, paginated: false, sortable: false})
  }),

  workspaceRoles: makeReducer({}, {})
})

export {
  reducer
}
