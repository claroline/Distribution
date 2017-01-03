import player from './player'
import editor from './editor'
import {MatchPaper} from './paper.jsx'

export default {
  type: 'application/x.match+json',
  name: 'match',
  paper: MatchPaper,
  player,
  editor
}
