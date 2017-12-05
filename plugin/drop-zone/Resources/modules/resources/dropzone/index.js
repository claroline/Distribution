import {bootstrap} from '#/main/core/utilities/app/bootstrap'
import {registerModalTypes} from '#/main/core/layout/modal'
import {generateUrl} from '#/main/core/fos-js-router'

import {reducer} from '#/plugin/drop-zone/resources/dropzone/reducer'
import {DropzoneResource} from '#/plugin/drop-zone/resources/dropzone/components/resource.jsx'
import {CorrectionModal} from '#/plugin/drop-zone/resources/dropzone/player/components/correction-modal.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.dropzone-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  DropzoneResource,

  // app store configuration
  reducer,

  // transform data attributes for redux store
  (initialData) => {
    return {
      user: initialData.user,
      userEvaluation: initialData.userEvaluation,
      resourceNode: initialData.resourceNode,
      dropzone: initialData.dropzone,
      myDrop: initialData.myDrop,
      peerDrop: initialData.peerDrop,
      nbCorrections: initialData.nbCorrections,
      drops: {
        data: [],
        totalResults: 0,
        fetchUrl: generateUrl('claro_dropzone_drops_search', {id: initialData.dropzone.id})
      },
      tools: {
        data: initialData.tools,
        totalResults: initialData.tools.length
      },
      teamEnabled: initialData.teamEnabled
    }
  }
)

registerModalTypes([
  ['MODAL_CORRECTION', CorrectionModal]
])
