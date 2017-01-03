import player from './player'
import editor from './editor'
import {ClozePaper} from './paper.jsx'

export default {
  type: 'application/x.cloze+json',
  name: 'cloze',
  paper: ClozePaper,
  player,
  editor
}
