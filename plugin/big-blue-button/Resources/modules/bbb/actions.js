import shajs from 'sha.js'
import {makeActionCreator} from '#/main/core/utilities/redux'
import {REQUEST_SEND} from '#/main/core/api/actions'

export const BBB_URL_UPDATE = 'BBB_URL_UPDATE'

export const actions = {}

actions.connectToBBB = () => (dispatch, getState) => {
  const state = getState()
  const params = state.resource
  const resourceNode = state.resourceNode
  const serverUrl = state.config.serverUrl
  const securitySalt = state.config.securitySalt
  let queryString = `meetingID=${resourceNode.id}&attendeePW=collaborator&moderatorPW=manager`
  queryString += params.record ? '&record=true' : '&record=false'
  queryString += params.roomName ? `&name=${encodeURIComponent(params.roomName)}` : ''
  queryString += params.welcomeMessage ? `&welcome=${encodeURIComponent(params.welcomeMessage)}` : ''
  const checksum = shajs('sha1').update(`create${queryString}${securitySalt}`).digest('hex')
  const createUrl = `${serverUrl}/bigbluebutton/api/create?${queryString}&checksum=${checksum}`

  dispatch(actions.generateBBBJoinUrl())

  dispatch({
    [REQUEST_SEND]: {
      url: createUrl,
      request: {
        method: 'GET'
      },
      success: (data, dispatch) => {
        dispatch(actions.generateBBBJoinUrl())
      }
    }
  })
}

actions.generateBBBJoinUrl = () => (dispatch, getState) => {
  const state = getState()
  const user = state.user
  const userName = user.fullName
  const resourceNode = state.resourceNode
  const serverUrl = state.config.serverUrl
  const securitySalt = state.config.securitySalt
  const password = state.canEdit ? 'manager' : 'collaborator'
  const queryString = `meetingID=${resourceNode.id}&password=${password}&userId=${user.id}&fullName=${encodeURIComponent(userName)}`
  const checksum = shajs('sha1').update(`join${queryString}${securitySalt}`).digest('hex')
  const joinUrl = `${serverUrl}/bigbluebutton/api/join?${queryString}&checksum=${checksum}`

  dispatch(actions.updateBBBJoinUrl(joinUrl))
}

actions.updateBBBJoinUrl = makeActionCreator(BBB_URL_UPDATE, 'url')