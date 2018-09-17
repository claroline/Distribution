import {createSelector} from 'reselect'

const STORE_NAME = 'resource'

const dropzone = createSelector(
  [resource],
  (resource) => resource.dropzone
)

export const select = {
  STORE_NAME,
  dropzone
}
