import {createSelector} from 'reselect'

const maintenance = state => state.maintenance
const parameters = state => state.parameters
const selfRegistration = createSelector(
  [parameters],
  (parameters) => parameters.selfRegistration
)


const sidebar = state => state.sidebar.name

export const selectors = {
  maintenance,
  selfRegistration,
  sidebar
}
