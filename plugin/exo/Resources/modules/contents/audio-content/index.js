import editor from './editor'
import {AudioContentPlayer} from './player.jsx'
import {AudioContentThumbnail} from './thumbnail.jsx'

export default {
  type: 'audio',
  icon: 'fa fa-file-audio-o',
  altIcon: 'fa fa-volume-down',
  player: AudioContentPlayer,
  browseFiles: 'audio',
  thumbnail: AudioContentThumbnail,
  editable: false,
  editor
}
