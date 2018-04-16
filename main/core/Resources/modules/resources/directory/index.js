import {DirectoryResource} from '#/main/core/resources/directory/components/resource'
import {reducer} from '#/main/core/resources/text/reducer'

/**
 * Directory resource application.
 *
 * @constructor
 */
export const App = () => ({
  component: DirectoryResource,
  store: reducer
})
