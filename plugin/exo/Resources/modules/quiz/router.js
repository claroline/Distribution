import {Router, history} from 'backbone'
import {actions} from './actions'
import {VIEW_EDITOR, VIEW_OVERVIEW, VIEW_PAPERS} from './enums'

export function makeRouter(dispatch) {
  const goTo = section => () => dispatch(actions.updateViewMode(section))
  const QuizRouter = Router.extend({
    routes: {
      'overview': goTo(VIEW_OVERVIEW),
      'editor': goTo(VIEW_EDITOR),
      'papers': goTo(VIEW_PAPERS),
      '.*': goTo(VIEW_OVERVIEW)
    }
  })
  new QuizRouter()
  history.start()
}
