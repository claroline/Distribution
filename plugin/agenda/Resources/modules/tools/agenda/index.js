import {bootstrap} from '#/main/app/dom/bootstrap'

import {reducer} from '#/plugin/agenda/tools/agenda/store/reducer'
import {AgendaTool} from '#/plugin/agenda/tools/agenda/containers/tool'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.agenda-container',

  // app main component
  AgendaTool,

  // app store configuration
  reducer,

  // remap data-attributes set on the app DOM container
  (initialData) => ({
    tool: {
      name: 'agenda',
      currentContext: initialData.currentContext
    }
  })
)
