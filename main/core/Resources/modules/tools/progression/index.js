import {ProgressionTool} from '#/main/core/tools/progression/components/tool'
import {reducer} from '#/main/core/tools/progression/store'

/**
 * Progression tool application.
 *
 * @constructor
 */
export const App = () => ({
  component: ProgressionTool,
  store: reducer,
  initialData: initialData => ({
    tool: {
      icon: 'tasks',
      name: 'progression',
      currentContext: initialData.currentContext
    },
    items: initialData.items,
    levelMax: initialData.levelMax
  })
})
