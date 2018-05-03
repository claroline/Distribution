import {ForumResource} from '#/plugin/forum/resources/forum/components/resource'
import {reducer} from '#/plugin/forum/resources/forum/reducer'
import {currentUser} from '#/main/core/user/current'


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
    subjectId: '238',
    content: 'la lal la la l uigez iuedigez gedgggde mzih',
    meta: {
      creator: currentUser(),
      created: '12 janvier 2012',
      updated: ''
    },
    comments: [
      {
        id: '123',
        content: 'Lorem blablablbalbalbalbalabl bab',
        meta: {
          creator: currentUser(),
          created: '12 janvier 2012',
          updated: ''
        }
      },
      {
        id: '1234',
        content: 'Maryline Baumard, journaliste chargée du suivi de l’immigration au Monde, a répondu aux questions des internautes sur le projet de loi asile et immigration qui a été adopté en première lecture, dimanche 22 avril, à l’Assemblée nationale.',
        meta: {
          creator: currentUser(),
          created: '13 janvier 2012',
          updated: ''
        }
      }
    ]
  },
  {
    id: '36',
    subjectId: '238',
    content: 'la lal la la l uigez iuedigez gedgggde mzih Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis veniam aperiam est illo, maiores explicabo ut! Ab, est. Sequi voluptatibus totam incidunt, non doloremque, qui velit. Quasi quis maxime obcaecati.',
    meta: {
      creator: currentUser(),
      created: '12/05/2012',
      updated: ''
    },
    comments: []
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
    messages: messages,
    forumForm: {
      data: initialData.forum
    }
  })
})
