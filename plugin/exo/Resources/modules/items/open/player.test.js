import freeze from 'deep-freeze'
import merge from 'lodash/merge'
import {ensure} from './../../utils/test'
import {actions} from './../../quiz/player/actions'
import {actions as subActions} from './player'
import definition from './index'

describe('Open reducer', () => {
  const reduce = definition.player.reduce

  it('augments and decorates base question on creation', () => {
    const item = {
      id: '1',
      type: 'application/x.open+json',
      content: 'Question?'
    }
    const reduced = reduce(item, actions.openItem('1', 'application/x.open+json'))
    ensure.equal(reduced, {
      id: '1',
      type: 'application/x.open+json',
      content: 'Question?',
      maxLength: 0,
      data:''
    })
  })

  it('updates answer and mark data as touched', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.answerUpdate('Data updated'))
    const expected = makeFixture({data: 'Data updated', _touched: {data: true}})
    ensure.equal(reduced, expected)
  })
})

function makeFixture(props = {}, frozen = true) {
  const fixture = merge({
    id: '1',
    type: 'application/x.open+json',
    content: 'Question?',
    maxLength: 0,
    data: 'My answer'
  }, props)

  return frozen ? freeze(fixture) : fixture
}
