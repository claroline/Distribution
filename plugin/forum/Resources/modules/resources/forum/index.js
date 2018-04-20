import {ForumResource} from '#/plugin/forum/resources/forum/components/resource'
import {reducer} from '#/plugin/forum/resources/forum/reducer'
import {currentUser} from '#/main/core/user/current'

const forum = {
  id: '123',
  display: {
    description: 'il faut causer sur ce forum !'
  },
  moderation: {},
  meta: {
    users: 34,
    subjects: 23,
    messages: 233
  }
}

const subject = {
  id: '238',
  title: 'la guerre civile d\'Espagne',
  tags: [
    'Guerre',
    'Armée',
    'Europe'
  ]
}

const messages = [
  {
    id: '36877',
    content: 'la lal la la l uigez iuedigez gedgggde mzih',
    meta: {
      creator: currentUser(),
      created: '12 janvier 2012',
      updated: ''
    }
  },
  {
    id: '36',
    content: 'la lal la la l uigez iuedigez gedgggde mzih Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis veniam aperiam est illo, maiores explicabo ut! Ab, est. Sequi voluptatibus totam incidunt, non doloremque, qui velit. Quasi quis maxime obcaecati.',
    meta: {
      creator: currentUser(),
      created: '12/05/2012',
      updated: ''
    }
  }
]

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
    messages: messages,
    forumForm: {
      data: forum
    }
  })
})
