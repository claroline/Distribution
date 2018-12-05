import {bootstrap} from '#/main/app/dom/bootstrap'

import {OpenBadgeDesktopTool} from '#/plugin/open-badge/desktop/components/tool'
import {reducer} from '#/plugin/open-badge/desktop/reducer'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.open-badge-container',

  // app main component
  OpenBadgeDesktopTool,

  // app store configuration
  reducer,

  // remap data-attributes set on the app DOM container
  // todo load remaining through ajax
  () => {


  }
)
