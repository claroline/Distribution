import editor from './editor'
import {ChoicePaper} from './paper.jsx'
import {ChoicePlayer} from './player.jsx'

export default {
  type: 'application/x.choice+json',
  name: 'choice',
  paper: ChoicePaper,
  player: ChoicePlayer,
  editor
}
