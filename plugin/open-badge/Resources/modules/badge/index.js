import {bootstrap} from '#/main/app/dom/bootstrap'

import {OpenBadgeAdminTool} from '#/plugin/open-badge/badge/components/tool'
import {reducer} from '#/plugin/open-badge/badge/reducer'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.open-badge-container',

  // app main component
  OpenBadgeAdminTool,

  // app store configuration
  reducer,

  // remap data-attributes set on the app DOM container
  // todo load remaining through ajax
  (initialData) => {
    return {
      workspace: initialData.workspace || null,
      context: initialData.context
    }
  }
)
