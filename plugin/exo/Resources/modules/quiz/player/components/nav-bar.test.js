import React from 'react'
import {shallow, mount} from 'enzyme'
import {spyConsole, renew, ensure, mockTranslator, mockRouting} from './../../../utils/test'
import {PlayerNav} from './nav-bar.jsx'

describe('<PlayerNav/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(PlayerNav, 'PlayerNav')
    mockTranslator()
    mockRouting()
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(<PlayerNav/>)
    ensure.missingProps(
      'PlayerNav',
      [
        'navigateTo',
        'finish',
        'submit'
      ]
    )
  })

  it('has typed props', () => {
    shallow(
      <PlayerNav
        next={[]}
        previous={[]}
        navigateTo={{}}
        finish={[]}
        submit={[]}
      />
    )
    ensure.invalidProps(
      'PlayerNav',
      [
        'next',
        'previous',
        'navigateTo',
        'finish',
        'submit'
      ]
    )
  })

  it('renders a navbar', () => {
    const navbar = mount(
      <PlayerNav
        next={null}
        previous={null}
        navigateTo={() => true}
        finish={() => true}
        submit={() => true}
      />
    )
    ensure.propTypesOk()
    ensure.equal(navbar.find('.player-nav').length, 1)

    ensure.equal(navbar.find('.btn-previous').length, 0)
    ensure.equal(navbar.find('.btn-next').length, 0)
    ensure.equal(navbar.find('.btn-next').length, 0)
  })

  it('renders a previous btn if there is a previous step', () => {
    const navbar = mount(
      <PlayerNav
          next={null}
          previous={null}
          navigateTo={() => true}
          finish={() => true}
          submit={() => true}
        />
    )
    ensure.propTypesOk()
    ensure.equal(navbar.find('btn-previous').length, 1)
  })
})
