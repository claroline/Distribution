import cloneDeep from 'lodash/cloneDeep'

import {combineReducers, makeReducer} from '#/main/core/scaffolding/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'

import {
  ENTRIES_UPDATE,
  ENTRY_ADD,
  ENTRY_UPDATE,
  CURRENT_ENTRY_LOAD,
  CURRENT_ENTRY_UPDATE,
  ENTRY_COMMENT_ADD,
  ENTRY_COMMENT_UPDATE,
  ENTRY_COMMENT_REMOVE,
  ALL_ENTRIES_REMOVE,
  ENTRY_USER_UPDATE,
  ENTRY_USER_UPDATE_PROP,
  ENTRY_USER_RESET,
  ENTRY_CATEGORY_ADD,
  ENTRY_CATEGORY_REMOVE,
  ENTRY_KEYWORD_ADD,
  ENTRY_KEYWORD_REMOVE
} from '#/plugin/claco-form/resources/claco-form/player/entry/actions'

const entriesReducer = makeReducer({}, {
  [ENTRY_ADD]: (state, action) => {
    const entries = cloneDeep(state)
    entries.push(action.entry)

    return entries
  },
  [ENTRY_UPDATE]: (state, action) => {
    const entries = cloneDeep(state)
    const index = entries.findIndex(c => c.id === action.entry.id)

    if (index >= 0) {
      entries[index] = action.entry
    }

    return entries
  },
  [ALL_ENTRIES_REMOVE]: (state) => {
    return state.filter(e => e.locked)
  },
  [ENTRY_COMMENT_ADD]: (state, action) => {
    const entries = cloneDeep(state)
    const entryIndex = entries.findIndex(e => e.id === action.entryId)

    if (entryIndex >= 0) {
      const comments = [action.comment, ...entries[entryIndex].comments]
      entries[entryIndex] = Object.assign({}, entries[entryIndex], {comments: comments})

      return entries
    } else {
      return state
    }
  },
  [ENTRY_COMMENT_UPDATE]: (state, action) => {
    const entries = cloneDeep(state)
    const entryIndex = entries.findIndex(e => e.id === action.entryId)

    if (entryIndex >= 0) {
      const comments = cloneDeep(entries[entryIndex].comments)
      const commentIndex = comments.findIndex(c => c.id === action.comment.id)

      if (commentIndex >= 0) {
        comments[commentIndex] = action.comment
        entries[entryIndex] = Object.assign({}, entries[entryIndex], {comments: comments})
      }

      return entries
    } else {
      return state
    }
  },
  [ENTRY_COMMENT_REMOVE]: (state, action) => {
    const entries = cloneDeep(state)
    const entryIndex = entries.findIndex(e => e.id === action.entryId)

    if (entryIndex >= 0) {
      const comments = cloneDeep(entries[entryIndex].comments)
      const commentIndex = comments.findIndex(c => c.id === action.commentId)

      if (commentIndex >= 0) {
        comments.splice(commentIndex, 1)
        entries[entryIndex] = Object.assign({}, entries[entryIndex], {comments: comments})
      }

      return entries
    } else {
      return state
    }
  }
})

const currentEntryReducer = makeReducer({}, {
  [CURRENT_ENTRY_LOAD]: (state, action) => {
    return action.entry
  },
  [CURRENT_ENTRY_UPDATE]: (state, action) => {
    return Object.assign({}, state, {[action.property]: action.value})
  },
  [ALL_ENTRIES_REMOVE]: () => {
    return {}
  },
  [ENTRY_COMMENT_ADD]: (state, action) => {
    if (state.id === action.entryId) {
      const comments = [action.comment, ...state.comments]

      return Object.assign({}, state, {comments: comments})
    } else {
      return state
    }
  },
  [ENTRY_COMMENT_UPDATE]: (state, action) => {
    if (state.id === action.entryId) {
      const comments = cloneDeep(state.comments)
      const index = comments.findIndex(c => c.id === action.comment.id)

      if (index >= 0) {
        comments[index] = action.comment
      }

      return Object.assign({}, state, {comments: comments})
    } else {
      return state
    }
  },
  [ENTRY_COMMENT_REMOVE]: (state, action) => {
    if (state.id === action.entryId) {
      const comments = cloneDeep(state.comments)
      const index = comments.findIndex(c => c.id === action.commentId)

      if (index >= 0) {
        comments.splice(index, 1)
      }

      return Object.assign({}, state, {comments: comments})
    } else {
      return state
    }
  }
})

const reducer = combineReducers({
  list: makeListReducer('entries.list', {}, {
    invalidated: makeReducer(false, {
      [FORM_SUBMIT_SUCCESS+'/entries.current']: () => true,
      [ENTRIES_UPDATE]: () => true
    })
  }),
  current: makeFormReducer('entries.current', {}, {
    data: makeReducer({}, {
      [ENTRY_CATEGORY_ADD]: (state, action) => {
        const newState = cloneDeep(state)
        const category = newState['categories'].find(c => c.id === action.category.id)

        if (!category) {
          newState['categories'].push(action.category)
        }

        return newState
      },
      [ENTRY_CATEGORY_REMOVE]: (state, action) => {
        const newState = cloneDeep(state)
        const index = newState['categories'].findIndex(c => c.id === action.categoryId)

        if (index > -1) {
          newState['categories'].splice(index, 1)
        }

        return newState
      },
      [ENTRY_KEYWORD_ADD]: (state, action) => {
        const newState = cloneDeep(state)
        const keyword = newState['keywords'].find(k => k.name.toUpperCase() === action.keyword.name.toUpperCase())

        if (!keyword) {
          newState['keywords'].push(action.keyword)
        }

        return newState
      },
      [ENTRY_KEYWORD_REMOVE]: (state, action) => {
        const newState = cloneDeep(state)
        const index = newState['keywords'].findIndex(k => k.id === action.keywordId)

        if (index > -1) {
          newState['keywords'].splice(index, 1)
        }

        return newState
      }
    })
  }),
  entryUser: makeReducer({}, {
    [ENTRY_USER_UPDATE]: (state, action) => action.entryUser,
    [ENTRY_USER_RESET]: () => ({}),
    [ENTRY_USER_UPDATE_PROP]: (state, action) => {
      const newEntryUser = cloneDeep(state)
      newEntryUser[action.property] = action.value

      return newEntryUser
    }
  }),
  myEntriesCount: makeReducer({}, {
    [ENTRY_ADD]: (state) => {
      return state + 1
    }
  })
})

export {
  reducer
}