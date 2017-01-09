import editor from './editor'
import {SetPaper} from './paper.jsx'
import {SetPlayer} from './player.jsx'
import {SetFeedback} from './feedback.jsx'

export default {
  type: 'application/x.set+json',
  name: 'set',
  paper: SetPaper,
  player: SetPlayer,
  feedback: SetFeedback,
  editor
}
