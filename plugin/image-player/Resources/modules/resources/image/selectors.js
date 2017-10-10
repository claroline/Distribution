import {createSelector} from 'reselect'
import {select as resourceSelect} from '#/main/core/layout/resource/selectors'

const image = state => state.image

const url = createSelector(
  [image],
  (image) => image.url
)

const hashName = createSelector(
  [image],
  (image) => image.hashName
)

const canDownload = createSelector(
  [resourceSelect.resourceNode],
  (resourceNode) => resourceNode.rights.current.export
)

export const select = {
  image,
  url,
  hashName,
  canDownload
}
