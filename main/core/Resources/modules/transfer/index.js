import {TransferTool} from '#/main/core/transfer/containers/tool'
//import {reducer} from '#/main/core/tools/transfer/store'
import {reducer} from '#/main/core/transfer/store/reducer'

/**
 * Resources tool application.
 *
 * @constructor
 */
export const App = () => ({
  component: TransferTool,
  store: reducer,
  initialData: initialData => {
    return {
      tool: {
        name: 'transfer'
      },
      explanation: initialData.explanation,
      currentContext: initialData.currentContext
    }}
})
