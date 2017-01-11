import {utils} from './utils'
import {ensure} from './../../../utils/test'

describe('Test splitting function', () => {
  it('Test the splitting function', () => {
    const text = 'Clarobot is very nice and carefree but sometimes a little bit boring'
    const answers = [
      {
        'text': 'nice',
        'score': 1,
        'feedback': 'yes he is !'
      },
      {
        'text': 'carefree',
        'score': 1,
        'feedback': 'yes he is !'
      },
      {
        'text': 'boring',
        'score': -1,
        'feedback': 'SHAME ON YOU !'
      }
    ]

    const splitted = utils.split(text, answers, false)
    ensure.equal(splitted[0].text, 'Clarobot is very nice')
    ensure.equal(splitted[1].text, ' and carefree')
    ensure.equal(splitted[2].text, ' but sometimes a little bit boring')
  })

})
