import {createSelector} from 'reselect'

const organizations = state => state.organizations
const options = state => state.options

export const select = {
  organizations,
  options
}
