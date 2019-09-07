import {makeActionCreator} from '#/main/app/store/actions'
import {url} from '#/main/app/api'
import {API_REQUEST} from '#/main/app/api'
import {trans} from '#/main/app/intl/translation'

export const COMPETENCIES_DATA_UPDATE = 'COMPETENCIES_DATA_UPDATE'
export const COMPETENCY_DATA_RESET = 'COMPETENCY_DATA_RESET'
export const COMPETENCY_DATA_LOAD = 'COMPETENCY_DATA_LOAD'
export const COMPETENCY_DATA_UPDATE = 'COMPETENCY_DATA_UPDATE'

export const actions = {}

//actions.displayCompetencyView = (objectiveId, competencyId) => {
//  return (dispatch) => {
//    dispatch(actions.fetchCompetencyData(objectiveId, competencyId))
//    dispatch(actions.updateViewMode(VIEW_COMPETENCY))
//  }
//}

actions.updateCompetenciesData = makeActionCreator(COMPETENCIES_DATA_UPDATE, 'competencyId', 'property', 'value')

actions.resetCompetencyData = makeActionCreator(COMPETENCY_DATA_RESET)
actions.loadCompetencyData = makeActionCreator(COMPETENCY_DATA_LOAD, 'data')
actions.updateCompetencyData = makeActionCreator(COMPETENCY_DATA_UPDATE, 'data')

actions.fetchCompetencyData = (objectiveId, competencyId) => {
  return (dispatch) => {
    dispatch({
      [API_REQUEST]: {
        url: ['hevinci_my_objectives_competency', {objective: objectiveId, competency: competencyId}],
        success: (data, dispatch) => {
          dispatch(actions.loadCompetencyData(data))
        }
      }
    })
  }
}

actions.fetchLevelData = (competencyId, level) => {
  return (dispatch) => {
    dispatch({
      [API_REQUEST]: {
        url: ['hevinci_my_objectives_competency_level', {competency: competencyId, level: level}],
        success: (data, dispatch) => {
          dispatch(actions.updateCompetencyData(data))
        }
      }
    })
  }
}

actions.fetchRelevantResource = (competencyId, level) => {
  return (dispatch) => {
    dispatch({
      [API_REQUEST]: {
        url: ['hevinci_my_objectives_competency_resource_fetch', {competency: competencyId, level: level}],
        success: (data) => {
          if (data && data['resourceId']) {
            const redirect = url(['claro_resource_open_short', {node: data['resourceId']}])
            window.location.href = redirect
          } else {
            dispatch(actions.updateCompetenciesData(competencyId, 'error', trans('objective.invalid_challenge_msg', {}, 'competency')))
          }
        }
      }
    })
  }
}