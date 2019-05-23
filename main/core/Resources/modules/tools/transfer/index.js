import {TransferTool} from '#/main/core/transfer/components/tool'
//import {reducer} from '#/main/core/tools/transfer/store'
import {reducer} from '#/main/core/transfer/reducer'

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
        name: 'transfer',
        currentContext: initialData.currentContext
      },
      explanation: initialData.explanation
    }}
})
