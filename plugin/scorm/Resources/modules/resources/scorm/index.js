import {reducer} from '#/plugin/scorm/resources/scorm/reducer'
import {ScormResource} from '#/plugin/scorm/resources/scorm/components/resource'

/**
 * Scorm resource application.
 *
 * @constructor
 */
export const App = () => ({
  component: ScormResource,
  store: reducer,
  styles: 'claroline-distribution-plugin-scorm-resource',
})