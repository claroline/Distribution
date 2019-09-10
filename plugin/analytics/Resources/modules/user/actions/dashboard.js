import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

/**
 * Opens the dashboard page of a user.
 */
export default (users, nodesRefresher, path) => ({
  name: 'dashboard',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-tachometer',
  label: trans('show-dashboard', {}, 'actions'),
  target: `${path}/${users[0].publicUrl}/dashboard`
})
