import React from 'react'
import {mount} from 'enzyme'
import {spyConsole, renew, ensure} from './../../utils/test'
import {SHAPE_RECT, SHAPE_CIRCLE} from './enums'
import {isCorrect} from './player'
import {GraphicPlayer} from './player.jsx'

describe('Graphic player', () => {
  describe('isCorrect', () => {
    it('detects points inside rectangles', () => {
      ensure.equal(isCorrect({x: 100, y: 300}, solutionsFixture()), true)
      ensure.equal(isCorrect({x: 100, y: -300}, solutionsFixture()), false)
    })

    it('detects points inside circles', () => {
      ensure.equal(isCorrect({x: 900, y: 1150}, solutionsFixture()), true)
      ensure.equal(isCorrect({x: 200, y: 1000}, solutionsFixture()), false)
    })
  })
})

describe('<GraphicPlayer/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(GraphicPlayer, 'GraphicPlayer')
  })
  afterEach(spyConsole.restore)

  it('renders an image', () => {
    const player = mount(
      <GraphicPlayer
        item={{
          image: {
            data: 'data:foo.jpg;qdsfqsd454545',
            width: 200
          },
          pointers: 0
        }}
        onChange={() => {}}
      />
    )
    ensure.propTypesOk()
    ensure.equal(player.find('img').length, 1)
  })
})

function solutionsFixture() {
  return [
    {
      area: {
        shape: SHAPE_RECT,
        coords: [
          {x: 50, y: 200},
          {x: 150, y: 500}
        ]
      }
    },
    {
      area: {
        shape: SHAPE_CIRCLE,
        center: {x: 800, y: 1000},
        radius: 200
      }
    }
  ]
}
