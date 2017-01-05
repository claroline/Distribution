import {Router, history} from 'backbone'
import {actions} from './actions'
import {actions as paperActions} from './papers/actions'
import {actions as playerActions} from './player/actions'
import {VIEW_EDITOR, VIEW_OVERVIEW} from './enums'

let router = null

export function makeRouter(dispatch) {
  const QuizRouter = Router.extend({
    routes: {
      'overview': () => dispatch(actions.updateViewMode(VIEW_OVERVIEW)),
      'editor': () => dispatch(actions.updateViewMode(VIEW_EDITOR)),
      'papers/:id': id => dispatch(paperActions.displayPaper(id)),
      'papers': () => dispatch(paperActions.listPapers()),
      'test': () => dispatch(playerActions.play(null, true)),
      'play': () => dispatch(playerActions.play(null, false)),
      '.*': () => dispatch(actions.updateViewMode(VIEW_OVERVIEW))
    }
  })
  router = new QuizRouter()
  history.start()
}

export function navigate(fragment) {
  if (!router) {
    throw new Error('Router has not been initialized')
  }

  return router.navigate(fragment, {trigger: true})
}
