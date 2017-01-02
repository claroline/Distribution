import player from './player'
import editor from './editor'
import paper from './paper.jsx'

export default {
  type: 'application/x.words+json',
  name: 'words',
  player,
  editor,
  paper
}
