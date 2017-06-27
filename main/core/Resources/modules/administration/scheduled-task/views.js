import {ManagementView} from './components/management-view.jsx'
import {MailFormView} from './components/mail-form-view.jsx'
import {MessageFormView} from './components/message-form-view.jsx'
import {
  VIEW_MANAGEMENT,
  VIEW_MAIL_FORM,
  VIEW_MESSAGE_FORM
} from './enums'

export const viewComponents = {
  [VIEW_MANAGEMENT]: ManagementView,
  [VIEW_MAIL_FORM]: MailFormView,
  [VIEW_MESSAGE_FORM]: MessageFormView
}
