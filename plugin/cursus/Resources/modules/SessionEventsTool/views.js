import {ManagerView}   from './components/managerView.jsx'
import {UserView}     from './components/userView.jsx'

export const VIEW_MANAGER = 'manager_mode'
export const VIEW_USER = 'user_mode'

export const viewComponents = {
  [VIEW_MANAGER]: ManagerView,
  [VIEW_USER]: UserView
}
