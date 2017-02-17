import editor from './editor'
import {TextContentPlayer} from './player.jsx'

export default {
  type: 'application/x.text-content+json',
  name: 'text',
  icon: 'fa fa-align-left',
  altIcon: 'fa fa-align-left',
  player: TextContentPlayer,
  editor
}
