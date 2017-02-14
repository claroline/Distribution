import editor from './editor'
//import {GraphicPaper} from './paper.jsx'
import {TextContentPlayer} from './player.jsx'
//import {GraphicFeedback} from './feedback.jsx'

//function expectAnswer(item) {
//  return item.solutions.filter(solution => solution.score > 0)
//}

export default {
  type: 'application/x.text-content+json',
  name: 'text',
  icon: 'file-text-o',
  smallIcon: 'file-text-o',
  player: TextContentPlayer,
  editor
}
