import {ForumResource} from '#/plugin/forum/resources/forum/components/resource'
import {reducer} from '#/plugin/forum/resources/forum/reducer'

const forum = {
  id: '123',
  display: {
    description: ''
  },
  moderation: {}
}

/**
 * Path resource application.
 *
 * @constructor
 */
export const App = () => ({
  component: ForumResource,
  store: reducer,
  styles: 'claroline-distribution-plugin-forum-forum-resource',
  initialData: initialData => Object.assign({}, initialData, {
    forum: forum,
    forumForm: {
      data: forum
    }
  })
})
