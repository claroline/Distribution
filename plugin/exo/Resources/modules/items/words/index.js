import player from './player'
import editor from './editor'
import {WordPaper} from './paper.jsx'

export default {
  type: 'application/x.words+json',
  name: 'words',
  paper: WordPaper,
  player,
  editor
}
