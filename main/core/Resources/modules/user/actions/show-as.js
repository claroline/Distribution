import {trans} from '#/main/app/intl/translation'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {actions as securityActions} from '#/main/app/security/store'

export default (rows) => ({
  type: ASYNC_BUTTON,
  icon: 'fa fa-fw fa-mask',
  label: trans('show_as'),
  scope: ['object'],
  request: {
    // url: ['claro_user_fetch', {user: rows[0].id, _switch: rows[0].username}],
    url: ['claro_desktop_open', {_switch: rows[0].username}],
    request: {
      method: 'GET'
    },
    success: (data, dispatch) => {
      // dispatch(securityActions.changeUser(data, true))
      window.location.reload()
    }
  }
})
