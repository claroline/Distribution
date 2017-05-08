import React from 'react'
import {shallow, mount} from 'enzyme'

import {spyConsole, renew, ensure} from '#/main/core/tests'
import {DatePicker} from './date-picker.jsx'

describe('<DatePicker/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(DatePicker, 'DatePicker')
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(
      React.createElement(DatePicker)
    )
    ensure.missingProps('DatePicker', ['name', 'onChange'])
  })

  it('has typed props', () => {
    shallow(
      React.createElement(DatePicker, {
        name: 123,
        value: false,
        onChange: 'foo'
      })
    )

    ensure.invalidProps('DatePicker', ['name', 'value', 'onChange'])
  })

  it('renders a clickable input', () => {
    const date = mount(
      React.createElement(DatePicker, {
        name: 'NAME',
        value: '2012-09-01',
        onChange: () => {}
      })
    )
    ensure.propTypesOk()

    const container = date.find('div')
    ensure.equal(container.length, 1)
    const input = container.find('input[type="text"]')
    ensure.equal(input.length, 1)

    input.simulate('click')

    ensure.equal(container.hasClass('react-datepicker__tether-enabled'), true)
  })
})
