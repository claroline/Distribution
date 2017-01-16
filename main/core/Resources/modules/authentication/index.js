import uuid from 'uuid'
import {generateUrl} from '#/main/core/fos-js-router'

const CLARO_AUTH_WINDOW = 'claro_auth_window'
const CLARO_AUTHENTICATED_MSG = 'AUTHENTICATED'

/**
 * Handles (re-)authentication in a separate window/tab. Returns a promise which
 * will be resolved on authentication success and rejected if the authentication
 * is closed before actual authentication took place.
 */
export function authenticate() {
  return new Promise((resolve, reject) => {
    // generate a hash id for the authentication attempt (it will serve to catch the
    // authentication event, avoiding a generic "authenticated" event; see below)
    const authHash = uuid()
    const authUrl = generateUrl('trigger_auth', {hash: authHash}, true)

    // open a dedicated (named) window for (re-)authentication
    const authWindow = window.open(authUrl, CLARO_AUTH_WINDOW)

    // the following should re-focus any pre-existing auth window (doesn't work great though...)
    authWindow.focus()

    let authenticated = false

    // if the authentication succeeded, the auth window will dispatch a custom event
    // named after the hash id (checking the auth window url is an extra measure)
    window.addEventListener(authHash, () => {
      if (authWindow.location.href === authUrl) {
        authenticated = true
        authWindow.close()
        resolve()
      }
    })

    // we must detect if the auth window was closed before authentication,
    // but as no event is provided for that, we have to setup a timer and check
    // regularly what's the window state
    const interval = setInterval(() => {
      if (authWindow.closed && !authenticated) {
        window.clearInterval(interval)
        reject(new Error('Authentication window closed before actual authentication'))
      }
    }, 100)
  })
}
