import {ManagerView} from './components/manager-view.jsx'
import {UserView} from './components/user-view.jsx'
import {EventView} from './components/event-view.jsx'

export const VIEW_MANAGER = 'manager_mode'
export const VIEW_USER = 'user_mode'
export const VIEW_EVENT = 'event_view'

export const viewComponents = {
  [VIEW_MANAGER]: ManagerView,
  [VIEW_USER]: UserView,
  [VIEW_EVENT]: EventView
}
