import {bootstrap} from '#/main/core/utilities/app/bootstrap'
import {registerModalTypes} from '#/main/core/layout/modal'

import {reducer} from '#/plugin/drop-zone/plugin/configuration/reducer'
import {Tools} from '#/plugin/drop-zone/plugin/configuration/components/tools.jsx'
import {CompilatioFormModal} from '#/plugin/drop-zone/plugin/configuration/components/modal/compilatio-form-modal.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.dropzone-plugin-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  Tools,

  // app store configuration
  reducer,

  // transform data attributes for redux store
  (initialData) => {
    return {
      tools: {
        data: initialData.tools,
        totalResults: initialData.tools.length
      }
    }
  }
)

registerModalTypes([
  ['MODAL_COMPILATIO_FORM', CompilatioFormModal]
])
