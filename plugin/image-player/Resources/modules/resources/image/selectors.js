import {createSelector} from 'reselect'

const image = state => state.image
const resourceNode = state => state.resourceNode

const url = createSelector(
  [image],
  (image) => image.url
)

const hashName = createSelector(
  [image],
  (image) => image.hashName
)

const canDownload = createSelector(
  [resourceNode],
  (resourceNode) => resourceNode.rights.current.export
)

export const select = {
  image,
  url,
  hashName,
  canDownload
}
