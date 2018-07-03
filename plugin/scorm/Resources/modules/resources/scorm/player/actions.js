import {API_REQUEST} from '#/main/app/api'
import {makeActionCreator} from '#/main/core/scaffolding/actions'

import {APIClass} from '#/plugin/scorm/resources/scorm/player/api'

const TRACKING_UPDATE = 'TRACKING_UPDATE'
const SUMMARY_PIN_TOGGLE  = 'SUMMARY_PIN_TOGGLE'
const SUMMARY_OPEN_TOGGLE = 'SUMMARY_OPEN_TOGGLE'

const actions = {}

actions.updateTracking = makeActionCreator(TRACKING_UPDATE, 'tracking')
actions.toggleSummaryPin = makeActionCreator(SUMMARY_PIN_TOGGLE)
actions.toggleSummaryOpen = makeActionCreator(SUMMARY_OPEN_TOGGLE)

actions.initializeAPI = (sco, scormData, trackings) => (dispatch) => {
  window.API = new APIClass(sco, scormData, trackings[sco.id], dispatch)
  window.api = new APIClass(sco, scormData, trackings[sco.id], dispatch)
  window.API_1484_11 = new APIClass(sco, scormData, trackings[sco.id], dispatch)
  window.api_1484_11 = new APIClass(sco, scormData, trackings[sco.id], dispatch)
}

actions.commitData = (scoId, mode, scoData) => ({
  [API_REQUEST]: {
    url: ['apiv2_scorm_sco_commit', {sco: scoId, mode: mode}],
    request: {
      body: JSON.stringify(scoData),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(actions.updateTracking(data))
    }
  }
})

export {
  actions,
  TRACKING_UPDATE,
  SUMMARY_PIN_TOGGLE,
  SUMMARY_OPEN_TOGGLE
}