import {createSelector} from 'reselect'

import {trans} from '#/main/core/translation'
import {param} from '#/main/app/config'
import {currentUser} from '#/main/core/user/current'

const workspaces = (state) => state.workspaces

const personalWorkspace = createSelector(
  [workspaces],
  (workspaces) => workspaces.personal
)

const currentWorkspace = createSelector(
  [workspaces],
  (workspaces) => workspaces.current
)

const workspacesHistory = createSelector(
  [workspaces],
  (workspaces) => workspaces.history
)

// this will later be retrieved from the store
const logo = () => param('logo')
const title = () => param('name')
const subtitle = () => param('secondaryName')
const help = () => param('help')
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

export const selectors = {
  workspaces,
  personalWorkspace,
  currentWorkspace,
  workspacesHistory,
  logo,
  title,
  subtitle,
  help,
  user,
  authenticated,
  locale
}
