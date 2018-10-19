import {ResourcesTool} from '#/main/core/tools/resources/components/tool'
import {reducer} from '#/main/core/tools/resources/store'

/**
 * Resources tool application.
 *
 * @constructor
 */
export const App = () => ({
  component: ResourcesTool,
  store: reducer,
  initialData: initialData => ({
    tool: {
      icon: 'folder',
      name: 'resource_manager',
      context: initialData.context
    },
    resourceManager: {
      root: initialData.root,
      directories: initialData.root ? [initialData.root] : []
    }
  })
})
