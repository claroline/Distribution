import {API_REQUEST} from '#/main/app/api'

// action creators
export const actions = {}
/**
 * Fetch the required data to open the current user desktop.
 */
actions.reset = (email) => ({
  [API_REQUEST]: {
    url: ['claro_security_send_token'],
    request: {
      method: 'POST',
      body: JSON.stringify({
        email: email
      })
    },
    success: () => {
    },
    error: () => {
    }
  }
})
