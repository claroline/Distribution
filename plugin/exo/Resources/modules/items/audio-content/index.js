import editor from './editor'
import {AudioContentPlayer} from './player.jsx'
import {utils} from './utils/utils'

export default {
  type: 'application/x.audio-content+json',
  name: 'audio',
  icon: 'fa fa-file-audio-o',
  altIcon: 'fa fa-volume-down',
  player: AudioContentPlayer,
  browseFiles: 'audio',
  onFileSelect: (item, file) => {return utils.onFileSelect(item, file)},
  editor
}
