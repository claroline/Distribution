import player from './player'
import editor from './editor'

export default {
  type: 'application/x.match+json',
  name: 'match',
  player: player,
  editor: editor
}
