import editor from './editor'
import {AudioContentPlayer} from './player.jsx'

export default {
  type: 'application/x.audio-content+json',
  name: 'audio',
  icon: 'fa fa-file-audio-o',
  altIcon: 'fa fa-volume-down',
  player: AudioContentPlayer,
  browseFiles: 'audio',
  editor
}
