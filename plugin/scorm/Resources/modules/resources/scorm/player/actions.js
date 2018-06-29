import {API_REQUEST} from '#/main/app/api'

const actions = {}

actions.commitData = (scoId, mode, scoData) => ({
  [API_REQUEST]: {
    url: ['apiv2_scorm_sco_commit', {sco: scoId}],
    request: {
      body: JSON.stringify({
        mode: mode,
        data: scoData
      }),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      console.log(data)
    }
  }
})

export {
  actions
}