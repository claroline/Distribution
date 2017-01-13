import {generateUrl} from '#/main/core/fos-js-router'

const CLARO_AUTH_WINDOW = 'claro_auth_window'
const CLARO_AUTHENTICATED_MSG = 'AUTHENTICATED'

export function authenticate() {
  return new Promise((resolve, reject) => {
    // open a dedicated (named) window for (re-)authentication
    const authWindow = window.open(generateUrl('trigger_auth'), CLARO_AUTH_WINDOW)
    let authenticated = false

    // we must detect if the auth window was closed before authentication,
    // but as no event is provided for that, we must setup a timer and check
    // regularly what's the window state
    const interval = setInterval(() => {
      if (authWindow.closed && !authenticated) {
        window.clearInterval(interval)
        reject(new Error('Authentication window closed before actual authentication'))
      }
    }, 100)

    // user might interact multiple times with the auth window (i.e. it can be loaded
    // several times)
    authWindow.addEventListener('load', () => {
      // the following should re-focus any pre-existing auth window (doesn't work great though...)
      authWindow.focus()

      // we consider authentication succeeded when the document body contains a certain text
      // (no way to check success with a more subtle mechanism, no access to the headers, etc.)
      if (authWindow.document.body.innerHTML === CLARO_AUTHENTICATED_MSG) {
        authenticated = true
        authWindow.close()
        resolve()
      }
    })
  })
}
