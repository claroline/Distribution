import editor from './editor'
import {ClozePaper} from './paper.jsx'
import {ClozePlayer} from './player.jsx'

export default {
  type: 'application/x.cloze+json',
  name: 'cloze',
  paper: ClozePaper,
  player: ClozePlayer,
  editor
}
