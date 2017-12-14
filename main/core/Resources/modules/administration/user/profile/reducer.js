import cloneDeep from 'lodash/cloneDeep'

import {makeId} from '#/main/core/utilities/id'
import {makeReducer} from '#/main/core/utilities/redux'
import {makeFormReducer} from '#/main/core/data/form/reducer'

import {
  PROFILE_FACET_OPEN,
  PROFILE_FACET_ADD,
  PROFILE_FACET_REMOVE,
  PROFILE_ADD_SECTION,
  PROFILE_REMOVE_SECTION
} from './actions'

const defaultState = {
  currentFacet: null,
  data: []
}

const reducer = makeFormReducer('profile', defaultState, {
  pendingChanges: makeReducer(false, {
    [PROFILE_FACET_ADD]: () => true,
    [PROFILE_FACET_REMOVE]: () => true,
    [PROFILE_ADD_SECTION]: () => true,
    [PROFILE_REMOVE_SECTION]: () => true
  }),
  data: makeReducer(defaultState.data, {
    [PROFILE_FACET_ADD]: (state) => {
      const newState = cloneDeep(state)

      newState.push({
        id: makeId(),
        title: 'New tab',
        sections: []
      })

      return newState
    },

    [PROFILE_FACET_REMOVE]: (state, action) => {
      const newState = cloneDeep(state)

      const pos = newState.findIndex(facet => facet.id === action.id)
      if (-1 !== pos) {
        newState.splice(pos, 1)
      }

      return newState
    },

    [PROFILE_ADD_SECTION]: (state, action) => {
      const newState = cloneDeep(state)

      const currentFacet = newState.find(facet => facet.id === action.facetId)
      if (currentFacet) {
        currentFacet.sections.push({
          id: makeId(),
          title: 'New section',
          fields: []
        })
      }

      return newState
    },

    [PROFILE_REMOVE_SECTION]: (state, action) => {
      const newState = cloneDeep(state)

      const currentFacet = newState.find(facet => facet.id === action.facetId)
      if (currentFacet) {
        const pos = currentFacet.sections.findIndex(section => section.id === action.sectionId)
        if (-1 !== pos) {
          currentFacet.sections.splice(pos, 1)
        }
      }

      return newState
    }
  }),
  currentFacet: makeReducer(defaultState.currentFacet, {
    [PROFILE_FACET_OPEN]: (state, action) => action.id
  })
})


export {
  reducer
}
