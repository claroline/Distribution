import {bootstrap} from '#/main/app/dom/bootstrap'

// reducers
import {reducer} from '#/main/core/transfer/store/reducer'
import {TransferTool} from '#/main/core/transfer/components/tool'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.transfer-container',

  // app main component
  TransferTool,

  // app store configuration
  reducer
)
