import player from './player'
import editor from './editor'
import {OpenPaper} from './paper.jsx'

export default {
  type: 'application/x.open+json',
  name: 'open',
  paper: OpenPaper,
  player,
  editor
}
