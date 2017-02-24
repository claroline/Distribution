import editor from './editor'
import {VideoContentPlayer} from './player.jsx'
import {utils} from './utils/utils'

export default {
  type: 'video',
  icon: 'fa fa-file-video-o',
  altIcon: 'fa fa-video-camera',
  player: VideoContentPlayer,
  browseFiles: 'video',
  onFileSelect: (item, file) => {return utils.onFileSelect(item, file)},
  editor
}
