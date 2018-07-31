import {HomeTool} from '#/main/core/tools/home/components/tool'
import {reducer} from '#/main/core/tools/home/reducer'

/**
 * Text resource application.
 *
 * @constructor
 */
export const App = () => ({
  component: HomeTool,
  store: reducer,
  initialData:   (initialData) => Object.assign({}, initialData, {
    editable: !!initialData.editable,
    editor:{
      data: initialData.tabs || [],
      originalData: initialData.tabs || []
    }
  })
})
