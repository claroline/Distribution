import {bootstrap} from '#/main/core/utilities/app/bootstrap'
import {registerModalTypes} from '#/main/core/layout/modal'

import {reducer} from './reducer'
import {DropzoneResource} from './components/resource.jsx'
import {CorrectionModal} from './player/components/correction-modal.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.dropzone-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  DropzoneResource,

  // app store configuration
  reducer
)

registerModalTypes([
  ['MODAL_CORRECTION', CorrectionModal]
])
