import {createSelector} from 'reselect'

import {selectors as cursusSelectors} from '#/plugin/cursus/tools/trainings/store/selectors'

const STORE_NAME = cursusSelectors.STORE_NAME + '.catalog'
const LIST_NAME = STORE_NAME + '.courses'
const FORM_NAME = STORE_NAME + '.courseForm'

const catalog = createSelector(
  [cursusSelectors.store],
  (store) => store.catalog
)

const course = createSelector(
  [catalog],
  (catalog) => catalog.course
)

const availableSessions = createSelector(
  [catalog],
  (catalog) => catalog.courseAvailableSessions
)

const activeSession = createSelector(
  [catalog],
  (catalog) => catalog.courseActiveSession
)

export const selectors = {
  STORE_NAME,
  LIST_NAME,
  FORM_NAME,

  course,
  activeSession,
  availableSessions
}