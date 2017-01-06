import editor from './editor'
import {ClozePaper} from './paper.jsx'
import {ClozePlayer} from './player.jsx'
import {CloozeFeedback} from './feedback.jsx'

export default {
  type: 'application/x.cloze+json',
  name: 'cloze',
  paper: ClozePaper,
  player: ClozePlayer,
  feedback: CloozeFeedback,
  editor
}
