import editor from './editor'
import {TextContentPlayer} from './player.jsx'

export default {
  type: 'application/x.text-content+json',
  name: 'text',
  icon: 'file-text-o',
  smallIcon: 'fa fa-file-text-o',
  player: TextContentPlayer,
  editor
}
