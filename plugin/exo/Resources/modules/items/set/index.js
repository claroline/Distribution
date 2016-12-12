import player from './player'
import editor from './editor'

export default {
  type: 'application/x.set+json',
  name: 'set',
  player: player,
  editor: editor
}
