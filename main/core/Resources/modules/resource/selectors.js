import {createSelector} from 'reselect'

const resourceLifecycle = state => state.resourceLifecycle

const resourceNode = state => state.resourceNode

const meta = createSelector(
  [resourceNode],
  (resourceNode) => resourceNode.meta
)

// todo : rename selector
const currentRights = createSelector(
  [resourceNode],
  (resourceNode) => resourceNode.permissions
)

const editable = createSelector(
  [currentRights],
  (currentRights) => currentRights.edit
)

const published = createSelector(
  [meta],
  (meta) => meta.published
)

const exportable = createSelector(
  [currentRights],
  (currentRights) => currentRights.export
)

const administrable = createSelector(
  [currentRights],
  (currentRights) => currentRights.administrate
)

const deletable = createSelector(
  [currentRights],
  (currentRights) => currentRights.delete
)

export const select = {
  resourceLifecycle,
  resourceNode,
  meta,
  currentRights,
  editable,
  published,
  exportable,
  administrable,
  deletable
}
