import player from './player'
import editor from './editor'
import {GraphicPaper} from './paper.jsx'

export default {
  type: 'application/x.graphic+json',
  name: 'graphic',
  paper: GraphicPaper,
  player,
  editor
}
