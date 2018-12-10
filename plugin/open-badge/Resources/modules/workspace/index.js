import {bootstrap} from '#/main/app/dom/bootstrap'

import {OpenBadgeWorkspaceTool} from '#/plugin/open-badge/workspace/components/tool'
import {reducer} from '#/plugin/open-badge/workspace/reducer'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.open-badge-container',

  // app main component
  OpenBadgeWorkspaceTool,

  // app store configuration
  reducer,

  // remap data-attributes set on the app DOM container
  // todo load remaining through ajax
  () => {


  }
)
