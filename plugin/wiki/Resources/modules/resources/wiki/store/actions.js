import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {API_REQUEST} from '#/main/app/api'
import {findInTree} from '#/plugin/wiki/resources/wiki/utils'

export const UPDATE_CURRENT_SECTION = 'UPDATE_CURRENT_SECTION'
export const UPDATE_ACTIVE_CONTRIBUTION = 'UPDATE_ACTIVE_CONTRIBUTION'
export const UPDATE_CURRENT_VERSION = 'UPDATE_CURRENT_VERSION'
export const UPDATE_COMPARE_VERSION_SET = 'UPDATE_COMPARE_VERSION_SET'

export const actions = {}

actions.updateCurrentSection = makeActionCreator(UPDATE_CURRENT_SECTION, 'section')
actions.updateActiveContribution = makeActionCreator(UPDATE_ACTIVE_CONTRIBUTION, 'sectionId', 'contribution')
actions.updateCurrentVersion = makeActionCreator(UPDATE_CURRENT_VERSION, 'contribution')
actions.updateCompareVersionSet = makeActionCreator(UPDATE_COMPARE_VERSION_SET, 'contributions')

actions.setCurrentSection = (sectionId = null) => {
  return (dispatch, getState) => {
    if (sectionId !== null) {
      dispatch(actions.updateCurrentSection(findInTree(getState().sectionTree, sectionId)))
    } else {
      dispatch(actions.updateCurrentSection({}))
    }
  }
}

actions.setActiveContribution = (sectionId, id) => ({
  [API_REQUEST]: {
    url: ['apiv2_wiki_section_contribution_set_active', {sectionId, id}],
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(actions.updateActiveContribution(sectionId, data))
    }
  }
})

actions.setCurrentVersion = (sectionId, id) => {
  actions.setCurrentSection(sectionId)
  return (dispatch, getState) => {
    if (id !== null) {
      const contribution = getState().sectionHistory.data.find(item => item.id === id)
      if (contribution) {
        dispatch(actions.updateCurrentVersion(contribution))
      } else {
        return {
          [API_REQUEST]: {
            url: ['apiv2_wiki_section_contribution_get', {sectionId, id}],
            request: {
              method: 'GET'
            },
            success: (data, dispatch) => {
              dispatch(actions.updateCurrentVersion(data))
            }
          }
        }
      }
    } else {
      dispatch(actions.updateCurrentVersion({}))
    }
  }
}


actions.setCompareVersionSet = (sectionId, id1, id2) => ({
  [API_REQUEST]: {
    url: ['apiv2_wiki_section_contribution_compare', {sectionId, id1, id2}],
    request: {
      method: 'GET'
    },
    success: (data, dispatch) => {
      dispatch(actions.updateCompareVersionSet(data))
    }
  }
})