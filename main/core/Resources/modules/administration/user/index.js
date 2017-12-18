import {bootstrap} from '#/main/core/utilities/app/bootstrap'

import {registerType} from '#/main/core/data'
import {FIELDS_TYPE, fieldsDefinition} from '#/main/core/data/types/fields'

import {registerModalType} from '#/main/core/layout/modal'
import {MODAL_DATA_PICKER, DataPickerModal} from '#/main/core/data/modal/containers/picker.jsx'
import {registerUserTypes} from '#/main/core/user/data'

import {reducer} from '#/main/core/administration/user/reducer'
import {UserTool} from '#/main/core/administration/user/components/tool.jsx'

// register custom modals
registerModalType(MODAL_DATA_PICKER, DataPickerModal)

// register dynamic fields type
registerType(FIELDS_TYPE,  fieldsDefinition)

// register user form fields
registerUserTypes()

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.users-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  UserTool,

  // app store configuration
  reducer,

  // remap data-attributes set on the app DOM container
  // todo load remaining through ajax
  (initialData) => {
    return {
      parameters: {
        data: initialData.parameters,
        originalData: initialData.parameters
      },
      profile: {
        data: initialData.profile,
        originalData: initialData.profile
      }
    }
  }
)
