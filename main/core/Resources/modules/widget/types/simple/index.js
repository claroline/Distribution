import {makeReducer} from '#/main/core/scaffolding/reducer'

import {SimpleWidget} from '#/main/core/widget/types/simple/components/widget'
import {SimpleWidgetEditor} from '#/main/core/widget/types/simple/components/editor'

export const Parameters = (context, parameters) => ({
  component: SimpleWidgetEditor
})

/**
 * Simple widget application.
 *
 * @param {object} context    - the context of widget rendering
 * @param {object} parameters - the current widget parameters
 *
 * @constructor
 */
export const App = (context, parameters) => ({
  component: SimpleWidget,
  store: {
    content: makeReducer(null, {}),
  },
  initialData: () => ({ // function is for retro compatibility with bootstrap()
    content: parameters.content
  })
})
