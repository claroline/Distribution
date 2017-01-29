import React from 'react'
import {mount} from 'enzyme'
import {spyConsole, renew, ensure} from './../../utils/test'
import {GraphicPlayer} from './player.jsx'

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
