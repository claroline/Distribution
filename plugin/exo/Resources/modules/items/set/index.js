import editor from './editor'
import {SetPaper} from './paper.jsx'
import {SetPlayer} from './player.jsx'

export default {
  type: 'application/x.set+json',
  name: 'set',
  paper: SetPaper,
  player: SetPlayer,
  editor
}
