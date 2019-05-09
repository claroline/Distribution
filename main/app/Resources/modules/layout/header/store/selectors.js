import {createSelector} from 'reselect'

import {trans} from '#/main/app/intl/translation'
import {param} from '#/main/app/config'
import {currentUser} from '#/main/app/security'

const STORE_NAME = 'header'

const store = (state) => state[STORE_NAME]

const mainMenu = createSelector(
  [store],
  (store) => store.mainMenu
)
const administration = createSelector(
  [store],
  (store) => store.administration
)
const tools = createSelector(
  [store],
  (store) => store.tools
)
const notificationTools = createSelector(
  [store],
  (store) => store.notificationTools
)
const count = createSelector(
  [store],
  (store) => store.notifications.count
)

const display = createSelector(
  [store],
  (store) => store.display
)

// this will later be retrieved from the store
const logo = () => param('logo')
const redirectHome = () => param('logo_redirect_home') || false
const title = () => param('name')
const subtitle = () => param('secondaryName')
const user = () => {
  let current = currentUser()
  if (!current) {
    // create a fake user for anonymous
    // this is a little hacky and cannot be used has a real user
    current = {
      name: trans('guest'),
      username: trans('guest'),
      roles: [{
        name: 'ROLE_ANONYMOUS',
        translationKey: 'anonymous'
      }]
    }
  }

  return current
}
const authenticated = () => !!currentUser()

const locale = () => param('locale')

const loginUrl = () => param('links.login')

const helpUrl = createSelector(
  [display],
  (display) => {
    if (display.help) {
      return param('links.help')
    }

    return null
  }
)

const registrationUrl = createSelector(
  [display],
  (display) => {
    if (display.registration) {
      return param('links.registration')
    }

    return null
  }
)

const maintenance = () => param('maintenance')

export const selectors = {
  STORE_NAME,
  mainMenu,
  administration,
  tools,
  notificationTools,
  count,
  logo,
  redirectHome,
  title,
  subtitle,
  display,
  user,
  authenticated,
  locale,
  loginUrl,
  helpUrl,
  registrationUrl,
  maintenance
}
