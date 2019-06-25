import {bootstrap} from '#/main/app/dom/bootstrap'

import {reducer} from '#/plugin/notification/desktop/tool/store/reducer'
import {List} from '#/plugin/notification/desktop/tool/components/notifications'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.desktop-notifications-container',

  // app main component
  List,

  // app store configuration
  reducer
)
