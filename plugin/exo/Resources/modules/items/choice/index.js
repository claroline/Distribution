import player from './player'
import editor from './editor'
import {ChoicePaper} from './paper.jsx'

export default {
  type: 'application/x.choice+json',
  name: 'choice',
  paper: ChoicePaper,
  player,
  editor
}
