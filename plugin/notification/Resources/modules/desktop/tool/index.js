import {reducer} from '#/plugin/notification/desktop/tool/store/reducer'
import {List} from '#/plugin/notification/desktop/tool/components/notifications'

/**
 * Notification application.
 *
 * @constructor
 */
export const App = () => ({
  component: List,
  styles: []
})

export default {
  component: List,
  store: reducer,
  styles: []
}
