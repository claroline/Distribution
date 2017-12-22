import {bootstrap} from '#/main/core/utilities/app/bootstrap'

import {reducer} from '#/main/core/contact/tool/reducer'
import {ContactsTool} from '#/main/core/contact/tool/components/contacts-tool.jsx'


// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.contacts-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  ContactsTool,

  // app store configuration
  reducer,

  // remap data-attributes set on the app DOM container
  // todo load remaining through ajax
  // (initialData) => {
  //
  //   return {}
  // }
)
