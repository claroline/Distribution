import {bootstrap} from '#/main/core/utilities/app/bootstrap'
import {registerModalTypes} from '#/main/core/layout/modal'

import {reducer} from './reducer'
import {Tools} from './components/tools.jsx'
import {ToolFormModal} from './components/tool-form-modal.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.dropzone-plugin-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  Tools,

  // app store configuration
  reducer
)

registerModalTypes([
  ['MODAL_TOOL_FORM', ToolFormModal]
])
