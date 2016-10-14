import React from 'react'
import {shallow, mount} from 'enzyme'
import {spyConsole, renew, ensure} from './../../test-utils'
import {Date, DateGroup} from './date.jsx'

describe('<Date/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(Date, 'Date')
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(<Date/>)
    ensure.missingProps('Date', ['name', 'onChange'])
  })

  it('has typed props', () => {
    shallow(
      <Date
        name={123}
        value={false}
        onChange="foo"
      />
    )
    ensure.invalidProps('Date', ['name', 'value', 'onChange'])
  })

  it('renders a clickable input', () => {
    const date = mount(
      <Date
        name="NAME"
        value="2012-09-01"
        onChange={() => {}}
      />
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

describe('<DateGroup/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(DateGroup, 'DateGroup')
  })
  afterEach(spyConsole.restore)

  it('inherits prop types of <Date/> and <FormGroup/>', () => {
    shallow(<DateGroup/>)
    ensure.missingProps('FormGroup', ['controlId', 'label'])
    ensure.missingProps('Date', ['name', 'onChange'])
  })

  it('wraps a <Date/> in a <FormGroup/>', () => {
    const group = mount(
      <DateGroup
        name="NAME"
        controlId="ID"
        label="LABEL"
        onChange={() => {}}
      />
    )
    ensure.propTypesOk()
    ensure.equal(group.find('div.form-group').length, 1)
    ensure.equal(group.find('input[type="text"]#ID').length, 1)
  })
})
