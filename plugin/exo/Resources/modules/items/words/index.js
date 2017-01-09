import editor from './editor'
import {WordsPaper} from './paper.jsx'
import {WordsPlayer} from './player.jsx'
import {WordFeedback} from './feedback.jsx'

export default {
  type: 'application/x.words+json',
  name: 'words',
  paper: WordsPaper,
  player: WordsPlayer,
  feedback: WordFeedback,
  editor
}
