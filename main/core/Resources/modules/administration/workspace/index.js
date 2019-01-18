import {bootstrap} from '#/main/core/scaffolding/bootstrap'

import {reducer} from '#/main/core/administration/workspace/workspace/reducer'
import {WorkspaceTool} from '#/main/core/administration/workspace/components/tool.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.workspaces-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  WorkspaceTool,

  // app store configuration
  reducer,

  (initialData) => {
    return {
        admin: initialData.admin
    }
  }
)
