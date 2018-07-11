import {AnnouncementResource} from '#/plugin/announcement/resources/anouncement/components/resource'
import {reducer} from '#/plugin/announcement/resources/anouncement/reducer'

/**
 * Announcement resource application.
 *
 * @constructor
 */
export const App = () => ({
  component: AnnouncementResource,
  store: reducer,
  styles: 'claroline-distribution-plugin-announcement-announcement-resource',
  initialData: (initialData) => Object.assign({}, initialData, {
    resource: {
      node: initialData.resourceNode,
      evaluation: initialData.evaluation
    }
  })
})
