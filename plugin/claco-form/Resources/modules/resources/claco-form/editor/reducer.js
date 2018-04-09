import cloneDeep from 'lodash/cloneDeep'

import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeReducer} from '#/main/core/scaffolding/reducer'

import {
  KEYWORD_ADD,
  KEYWORD_UPDATE,
  KEYWORDS_REMOVE
} from '#/plugin/claco-form/resources/claco-form/editor/actions'

const reducer = makeFormReducer('clacoFormForm', {}, {
  data: makeReducer({}, {
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
  categories: makeListReducer('clacoFormForm.categories', {}, {}),
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