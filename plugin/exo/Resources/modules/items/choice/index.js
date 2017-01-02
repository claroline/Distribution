import player from './player'
import editor from './editor'
import paper from './paper.jsx'

export default {
  type: 'application/x.choice+json',
  name: 'choice',
  player,
  editor,
  paper
}
