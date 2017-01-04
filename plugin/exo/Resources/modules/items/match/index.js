import editor from './editor'
import {MatchPaper} from './paper.jsx'
import {MatchPlayer} from './player.jsx'

export default {
  type: 'application/x.match+json',
  name: 'match',
  paper: MatchPaper,
  player: MatchPlayer,
  editor
}
