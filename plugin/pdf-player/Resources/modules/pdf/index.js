import {bootstrap} from '#/main/core/scaffolding/bootstrap'

import {reducer} from '#/plugin/video-player/resources/video/reducer'
import {PdfPlayerResource} from '#/plugin/pdf-player/resources/pdf/components/resource.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.pdf-player-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  PdfPlayerResource,

  // app store configuration
  reducer
)