import {createSelector} from 'reselect'

import {trans} from '#/main/app/intl/translation'
import {selectors as formSelectors} from '#/main/app/content/form/store/selectors'

const STORE_NAME = 'main_settings'
const FORM_NAME = STORE_NAME+'.parameters'

const store = (state) => state[STORE_NAME]

const availableLocales = createSelector(
  [store],
  (store) => store.availableLocales
)

const parameters = (state) => formSelectors.data(formSelectors.form(state, FORM_NAME))

const locales = createSelector(
  [parameters],
  (parameters) => parameters.locales
)

const archives = createSelector(
  [parameters],
  (parameters) => parameters.archives
)

const plugins = createSelector(
  [store],
  (store) => store.plugins
)

const toolChoices = createSelector(
  [store],
  (store) => store.tools.reduce((acc, current) => Object.assign(acc, {
    [current]: trans(current, {}, 'tools')
  }), {})
)

const theme = createSelector(
  [parameters],
  (parameters) => parameters.theme
)

const iconSetChoices = createSelector(
  [store],
  (store) => store.iconSetChoices.reduce((acc, current) => Object.assign(acc, {
    [current]: current
  }), {})
)

export const selectors = {
  STORE_NAME,
  FORM_NAME,

  availableLocales,
  parameters,
  locales,
  plugins,
  archives,
  toolChoices,
  theme,
  iconSetChoices
}
