import editor from './editor'
import {PairPaper} from './paper.jsx'
import {PairPlayer} from './player.jsx'

export default {
  type: 'application/x.pair+json',
  name: 'pair',
  paper: PairPaper,
  player: PairPlayer,
  editor
}
