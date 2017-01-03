import {Router, history} from 'backbone'
import {actions} from './actions'
import {actions as paperActions} from './papers/actions'
import {VIEW_EDITOR, VIEW_OVERVIEW} from './enums'

export function makeRouter(dispatch) {
  const QuizRouter = Router.extend({
    routes: {
      'overview': () => dispatch(actions.updateViewMode(VIEW_OVERVIEW)),
      'editor': () => dispatch(actions.updateViewMode(VIEW_EDITOR)),
      'quiz/:qid/papers/:pid': (quizId, paperId) => {
        dispatch(paperActions.displayPaper(quizId, paperId))
      },
      'papers': () => dispatch(paperActions.listPapers()),
      '.*': () => dispatch(actions.updateViewMode(VIEW_OVERVIEW))
    }
  })
  new QuizRouter()
  history.start()
}
