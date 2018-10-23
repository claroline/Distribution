import {bootstrap} from '#/main/app/dom/bootstrap'

import {reducer} from '#/main/core/administration/settings/main/reducer'
import {Tool} from '#/main/core/administration/settings/main/components/tool.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.main-settings-container',

  // app main component
  Tool,

  // app store configuration
  reducer,


  // remap data-attributes set on the app DOM container
  // todo load remaining through ajax
  (initialData) => {
    return {
      parameters: {
        data: initialData.parameters,
        originalData: initialData.parameters
      }
    }
  }
)
