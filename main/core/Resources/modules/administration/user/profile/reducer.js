import cloneDeep from 'lodash/cloneDeep'

import {makeId} from '#/main/core/utilities/id'
import {makeReducer} from '#/main/core/utilities/redux'
import {makeFormReducer} from '#/main/core/data/form/reducer'

import {
  PROFILE_FACET_OPEN,
  PROFILE_FACET_ADD,
  PROFILE_FACET_REMOVE,
  PROFILE_ADD_SECTION,
  PROFILE_REMOVE_SECTION,
  PROFILE_ADD_FIELD,
  PROFILE_REMOVE_FIELD
} from './actions'

const defaultState = {
  currentFacet: null,
  data: []
}

const reducer = makeFormReducer('profile', defaultState, {
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

      /*const currentFacet = newState.find(facet => facet.id === action.facetId)
      if (currentFacet) {
        currentFacet.sections.push({
          id: makeId(),
          title: 'New tab',
          fields: []
        })
      }*/

      return newState
    },
    [PROFILE_ADD_FIELD]: (state, action) => {
      const newState = cloneDeep(state)

      const currentFacet = newState.find(facet => facet.id === action.facetId)
      if (currentFacet) {
        const currentSection = currentFacet.sections.find(section => section.id === action.sectionId)
        if (currentSection) {
          currentSection.push({
            id: makeId(),
            type: action.fieldType,
            title: 'New field',
          })
        }
      }
    },
    [PROFILE_REMOVE_FIELD]: (state, action) => {

    }
  }),
  currentFacet: makeReducer(defaultState.currentFacet, {
    [PROFILE_FACET_OPEN]: (state, action) => action.id
  })
})


export {
  reducer
}
