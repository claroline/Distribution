import React from 'react'
import {shallow} from 'enzyme'
import {spyConsole, renew, ensure} from '#/main/core/tests'
import {SubSection} from './sub-section.jsx'

describe('<SubSection/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(SubSection, 'SubSection')
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(
      React.createElement(SubSection)
    )

    ensure.missingProps(
      'SubSection',
      ['showText', 'hideText', 'children']
    )
  })

  it('has typed props', () => {
    shallow(
      React.createElement(SubSection, {
        showText: 123,
        hideText: false
      }, 'Bar')
    )

    ensure.invalidProps(
      'SubSection',
      ['showText', 'hideText']
    )
  })

  it('Renders a link to toggle section', () => {
    const section = shallow(
      React.createElement(SubSection, {
        showText: 'Show section',
        hideText: 'Hide section'
      }, 'Bar')
    )

    ensure.propTypesOk()

    const showLink = section.childAt(0)
    ensure.equal(showLink.name(), 'a')
    ensure.equal(showLink.text(), 'Show section')

    // show
    showLink.simulate('click')
    ensure.equal(section.find('.collapse').hasClass('in'), true)

    // hide
    showLink.simulate('click')
    ensure.equal(section.find('.collapse').hasClass('in'), false)
  })
})
