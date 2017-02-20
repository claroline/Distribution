import editor from './editor'
import {VideoContentPlayer} from './player.jsx'
import {utils} from './utils/utils'

export default {
  type: 'application/x.video-content+json',
  name: 'video',
  icon: 'fa fa-file-video-o',
  altIcon: 'fa fa-video-camera',
  player: VideoContentPlayer,
  browseFiles: 'video',
  onFileSelect: (file) => {utils.onFileSelect(file)},
  editor
}
