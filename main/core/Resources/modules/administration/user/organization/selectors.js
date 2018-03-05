import {flatten} from '#/main/core/scaffolfing/tree'

import {createSelector} from 'reselect'

const organizations = state => state.organizations

const flattenedOrganizations = createSelector(
  [organizations],
  (organizations) => flatten(organizations.list.data)
)

export const select = {
  organizations,
  flattenedOrganizations
}
