import player from './player'
import editor from './editor'

export default {
  type: 'application/x.choice+json',
  name: 'choice',
  player: player,
  editor: editor
}
