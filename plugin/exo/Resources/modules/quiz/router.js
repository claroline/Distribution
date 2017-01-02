import {Router, history} from 'backbone'
import {actions} from './actions'
import {actions as paperActions} from './papers/actions'
import {VIEW_EDITOR, VIEW_OVERVIEW, VIEW_PAPERS} from './enums'

export function makeRouter(dispatch) {
  const goTo = section => () => dispatch(actions.updateViewMode(section))
  const QuizRouter = Router.extend({
    routes: {
      'overview': () => dispatch(actions.updateViewMode(VIEW_OVERVIEW)),
      'editor': () => dispatch(actions.updateViewMode(VIEW_EDITOR)),
      'papers/:id': id => dispatch(paperActions.displayPaper(id)),
      'papers': () => dispatch(paperActions.listPapers()),
      '.*': () => dispatch(actions.updateViewMode(VIEW_OVERVIEW))
    }
  })
  new QuizRouter()
  history.start()
}
