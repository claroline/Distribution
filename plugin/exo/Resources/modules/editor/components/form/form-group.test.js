import React from 'react'
import {shallow} from 'enzyme'
import {spyConsole, renew, ensure} from './../../test-utils'
import {FormGroup} from './form-group.jsx'

describe('<FormGroup/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(FormGroup, 'FormGroup')
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(<FormGroup/>)
    ensure.missingProps('FormGroup', ['controlId', 'label', 'children'])
  })

  it('has typed props', () => {
    shallow(<FormGroup controlId={true} label={123}>{[]}</FormGroup>)
    ensure.invalidProps('FormGroup', ['controlId', 'label', 'children'])
  })

  it('renders a label and a given field', () => {
    const group = shallow(
      <FormGroup controlId="ID" label="LABEL">
        <input id="ID" name="NAME" type="text" value="VALUE"/>
      </FormGroup>
    )
    ensure.propTypesOk()
    ensure.equal(group.name(), 'div')
    ensure.equal(group.hasClass('form-group'), true)
    ensure.equal(group.children().length, 2)

    const label = group.childAt(0)
    ensure.equal(label.name(), 'label')
    ensure.equal(label.hasClass('control-label'), true)
    ensure.equal(label.props().htmlFor, 'ID')

    const input = group.childAt(1)
    ensure.equal(input.name(), 'input')
    ensure.equal(input.props().name, 'NAME')
  })

  it('displays an help text if any', () => {
    const group = shallow(
      <FormGroup controlId="ID" label="LABEL" help="HELP">
        <input id="ID" name="NAME" type="text" value="VALUE"/>
      </FormGroup>
    )
    ensure.propTypesOk()
    ensure.equal(group.find('span#help-ID.help-block').text(), 'HELP')
  })

  it('displays an error if any', () => {
    const group = shallow(
      <FormGroup controlId="ID" label="LABEL" error="ERROR">
        <input id="ID" name="NAME" type="text" value="VALUE"/>
      </FormGroup>
    )
    ensure.propTypesOk()
    ensure.equal(group.hasClass('has-error'), true)
    ensure.equal(group.find('span#help-ID.help-block').text(), 'ERROR')
  })
})
