import {combineReducers, makeReducer} from '#/main/core/scaffolding/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'

import {
  UPDATE_EDIT_SECTION
} from '#/plugin/wiki/resources/wiki/player/store/actions'
import {
  UPDATE_ACTIVE_CONTRIBUTION
} from '#/plugin/wiki/resources/wiki/history/store/actions'
import {updateInTree} from '#/plugin/wiki/resources/wiki/utils'

const defaultCurrentSection = {
  id: null
}
const reducer = combineReducers({
  tree: makeReducer({}, {
    [UPDATE_ACTIVE_CONTRIBUTION]: (state, action) => {
      return updateInTree(state, action.sectionId, 'activeContribution', action.contribution)
    }
  }),
  currentSection: makeFormReducer('currentSection', defaultCurrentSection, {
    id: makeReducer(defaultCurrentSection.id, {
      [UPDATE_EDIT_SECTION]: (state, action) => action.sectionId
    })
  })
})

export {
  reducer
}