import {bootstrap} from '#/main/core/utilities/app/bootstrap'

import {registerModalType} from '#/main/core/layout/modal'
import {MODAL_DATA_PICKER, DataPickerModal} from '#/main/core/data/modal/containers/picker.jsx'
import {MODAL_GENERATE_FIELD, GenerateFieldModal} from '#/main/core/data/form/generator/components/modal/generate-field.jsx'

import {reducer} from '#/main/core/administration/user/reducer'
import {UserTool} from '#/main/core/administration/user/components/tool.jsx'

// register custom modals
registerModalType(MODAL_DATA_PICKER, DataPickerModal)
registerModalType(MODAL_GENERATE_FIELD, GenerateFieldModal)

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.users-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  UserTool,

  // app store configuration
  reducer,

  // remap data-attributes set on the app DOM container
  (initialData) => {
    return {
      parameters: {
        data: initialData.parameters
      },
      profile: {
        data: [
          {
            id: 'main',
            title: 'Informations générales',
            meta: {
              main: true
            },
            sections: []
          }, {
            id: 'scol',
            title: 'Scolarité',
            sections: []
          }
        ]
      }
    }
  }
)
