import {select as formSelectors} from '#/main/core/data/form/selectors'

const STORE_NAME = 'widgetParameters'

const data = (state) => formSelectors.data(formSelectors.form(state, STORE_NAME))
const saveEnabled = (state) => formSelectors.saveEnabled(formSelectors.form(state, STORE_NAME))

export const selectors = {
  STORE_NAME,
  data,
  saveEnabled
}