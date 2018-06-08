import {createSelector} from 'reselect'

import {select as formSelect} from '#/main/core/data/form/selectors'

const STORE_NAME = 'resourceCreation'
const FORM_NAME = `${STORE_NAME}.form`

const store = (state) => state[STORE_NAME]

const parent = createSelector(
  [store],
  (store) => store.parent
)

const form = (state) => formSelect.form(state, FORM_NAME)

const saveEnabled = (state) => formSelect.saveEnabled(form(state))

export const selectors = {
  STORE_NAME,
  FORM_NAME,
  parent,
  form,
  saveEnabled
}
