import cloneDeep from 'lodash/cloneDeep'

import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeReducer} from '#/main/core/scaffolding/reducer'

import {
  CATEGORY_ADD,
  CATEGORY_UPDATE,
  CATEGORIES_REMOVE,
  KEYWORD_ADD,
  KEYWORD_UPDATE,
  KEYWORDS_REMOVE
} from '#/plugin/claco-form/resources/claco-form/editor/actions'

const reducer = makeFormReducer('clacoFormForm', {}, {
  data: makeReducer({}, {
    [CATEGORY_ADD]: (state, action) => {
      const newState = cloneDeep(state)
      newState['categories'].push(action.category)

      return newState
    },
    [CATEGORY_UPDATE]: (state, action) => {
      const newState = cloneDeep(state)
      const index = newState['categories'].findIndex(c => c.id === action.category.id)

      if (index >= 0) {
        newState['categories'][index] = action.category
      }

      return newState
    },
    [CATEGORIES_REMOVE]: (state, action) => {
      const newState = cloneDeep(state)
      action.ids.forEach(id => {
        const index = newState['categories'].findIndex(c => c.id === id)

        if (index >= 0) {
          newState['categories'].splice(index, 1)
        }
      })

      return newState
    },
    [KEYWORD_ADD]: (state, action) => {
      const newState = cloneDeep(state)
      newState['keywords'].push(action.keyword)

      return newState
    },
    [KEYWORD_UPDATE]: (state, action) => {
      const newState = cloneDeep(state)
      const index = newState['keywords'].findIndex(k => k.id === action.keyword.id)

      if (index >= 0) {
        newState['keywords'][index] = action.keyword
      }

      return newState
    },
    [KEYWORDS_REMOVE]: (state, action) => {
      const newState = cloneDeep(state)
      action.ids.forEach(id => {
        const index = newState['keywords'].findIndex(k => k.id === id)

        if (index >= 0) {
          newState['keywords'].splice(index, 1)
        }
      })

      return newState
    }
  }),
  categories: makeListReducer('clacoFormForm.categories', {}, {
    invalidated: makeReducer(false, {
      [CATEGORY_ADD]: () => true,
      [CATEGORY_UPDATE]: () => true,
      [CATEGORIES_REMOVE]: () => true
    })
  }),
  keywords: makeListReducer('clacoFormForm.keywords', {}, {
    invalidated: makeReducer(false, {
      [KEYWORD_ADD]: () => true,
      [KEYWORD_UPDATE]: () => true,
      [KEYWORDS_REMOVE]: () => true
    })
  })
})

export {
  reducer
}