import {HomeTool} from '#/main/core/tools/home/components/tool'

import {reducer} from '#/main/core/tools/home/reducer'

/**
 * Desktop Administration application.
 *
 * @constructor
 */
export const App = () => ({
  component: HomeTool,
  store: reducer,
  initialData:   (initialData) => Object.assign({}, initialData, {
    editable: initialData.editable,
    context: initialData.context,
    editor:{
      data: initialData.tabs || [],
      originalData: initialData.tabs || []
    }
  })
})
