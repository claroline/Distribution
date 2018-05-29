import {createSelector} from 'reselect'

const path = state => state.pathForm.data
const stepCopy = state => state.pathForm.copy

const steps= createSelector(
  [path],
  (path) => path.steps || []
)

export const select = {
  path,
  stepCopy,
  steps
}
