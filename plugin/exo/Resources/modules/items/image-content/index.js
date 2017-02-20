import editor from './editor'
import {ImageContentPlayer} from './player.jsx'
import {utils} from './utils/utils'

export default {
  type: 'application/x.image-content+json',
  name: 'image',
  icon: 'fa fa-file-image-o',
  altIcon: 'fa fa-picture-o',
  player: ImageContentPlayer,
  browseFiles: 'image',
  onFileSelect: (item, file) => {return utils.onFileSelect(item, file)},
  editor
}