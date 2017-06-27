import {Router, history} from 'backbone'
import {actions} from './actions'
import {
  VIEW_MANAGEMENT,
  VIEW_MAIL_FORM,
  VIEW_MESSAGE_FORM
} from './enums'

let router = null

export function makeRouter(dispatch) {
  const AdminTaskToolRouter = Router.extend({
    routes: {
      '': () => dispatch(actions.updateViewMode(VIEW_MANAGEMENT)),
      'mail': () => dispatch(actions.updateViewMode(VIEW_MAIL_FORM)),
      'message': () => dispatch(actions.updateViewMode(VIEW_MESSAGE_FORM))
    }
  })
  router = new AdminTaskToolRouter()
  history.start()
}

export function navigate(fragment, trigger = true) {
  if (!router) {
    throw new Error('Router has not been initialized')
  }

  return router.navigate(fragment, {trigger})
}
