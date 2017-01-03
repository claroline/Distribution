import editor from './editor'
import {GraphicPaper} from './paper.jsx'
import {GraphicPlayer} from './player.jsx'

export default {
  type: 'application/x.graphic+json',
  name: 'graphic',
  paper: GraphicPaper,
  player: GraphicPlayer,
  editor
}
