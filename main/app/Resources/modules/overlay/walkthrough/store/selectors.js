import {createSelector} from 'reselect'
import isEmpty from 'lodash/isEmpty'

const STORE_NAME = 'walkthrough'

const store = state => state[STORE_NAME]

const skipped = createSelector(
  [store],
  (store) => store.skipped
)

const started = createSelector(
  [store],
  (store) => store.started
)

const finished = createSelector(
  [store],
  (store) => store.finished
)

const current = createSelector(
  [store],
  (store) => store.current
)

const steps = createSelector(
  [store],
  (store) => store.steps
)

const currentStep = createSelector(
  [steps, current],
  (steps, current) => steps[current]
)

const active = createSelector(
  [started, skipped, finished, currentStep],
  (started, skipped, finished, currentStep) => started && !finished && !skipped && !isEmpty(currentStep)
)

const hasPrevious = createSelector(
  [steps, current],
  (steps, current) => 0 !== current
)

const hasNext = createSelector(
  [steps, current],
  (steps, current) => steps.length - 1 !== current
)

export const selectors = {
  STORE_NAME,

  skipped,
  started,
  finished,
  active,
  steps,
  current,
  currentStep,
  hasPrevious,
  hasNext
}
