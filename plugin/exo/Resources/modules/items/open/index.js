import player from './player'
import editor from './editor'

export default {
  type: 'application/x.open+json',
  name: 'open',
  player: player,
  editor: editor
}
