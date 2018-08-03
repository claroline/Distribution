import {selectors as formSelectors} from '#/main/app/content/form/store/selectors'

const newMessage = (state) => formSelectors.data(formSelectors.form(state, 'messageForm'))
const message = (state) => state.message

export const selectors = {
  newMessage,
  message
}
