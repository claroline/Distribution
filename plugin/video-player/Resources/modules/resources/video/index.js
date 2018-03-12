import {bootstrap} from '#/main/core/scaffolding/bootstrap'

import {reducer} from '#/plugin/video-player/resources/video/reducer'

import {VideoPlayerResource} from '#/plugin/video-player/resources/video/components/resource.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.video-player-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  VideoPlayerResource,

  // app store configuration
  reducer
)