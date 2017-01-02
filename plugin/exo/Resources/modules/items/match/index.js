import player from './player'
import editor from './editor'
import paper from './paper.jsx'

export default {
  type: 'application/x.match+json',
  name: 'match',
  player,
  editor,
  paper
}
