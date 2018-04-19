import {ForumResource} from '#/plugin/forum/resources/forum/components/resource'
import {reducer} from '#/plugin/forum/resources/forum/reducer'

const forum = {
  id: '123',
  display: {
    description: 'bla bla bla'
  },
  moderation: {},
  meta: {
    'users': 34,
    'subjects': 23,
    'messages': 233
  }
}

const subject = {
  id: '238',
  title: 'la guerre civile'
}

const message = {
  id: '36877',
  content: 'la lal la la l uigez iuedigez gedgggde mzih',
  meta: {
    creator: {
      name: 'Denis',
      avatar: 'img'
    },
    created: '12 janvier 2012',
    updated: ''
  }
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
    subject: subject,
    message: message,
    forumForm: {
      data: forum
    }
  })
})
