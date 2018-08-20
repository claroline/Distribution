import {selectors as formSelectors} from '#/main/app/content/form/store/selectors'

const STORE_NAME = 'widgetCreation'

const saveEnabled = (state) => formSelectors.saveEnabled(formSelectors.form(state, STORE_NAME))
const widget = (state) => formSelectors.data(formSelectors.form(state, STORE_NAME))

export const selectors = {
  STORE_NAME,
  saveEnabled,
  widget
}
