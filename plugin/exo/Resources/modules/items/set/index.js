import player from './player'
import editor from './editor'
import {SetPaper} from './paper.jsx'

export default {
  type: 'application/x.set+json',
  name: 'set',
  paper: SetPaper,
  player,
  editor
}
