import {bootstrap} from '#/main/core/scaffolding/bootstrap'
import {reducer} from '#/main/core/contact/tool/reducer'
import {ContactsTool} from '#/main/core/contact/tool/components/contacts-tool.jsx'


// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.contacts-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  ContactsTool,

  // app store configuration
  reducer
)