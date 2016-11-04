import React from 'react'
import {shallow, mount} from 'enzyme'
import {spyConsole, renew, ensure} from './../test-utils'
import {ResourcePicker} from './resource-picker.jsx'

describe('<ResourcePicker/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(ResourcePicker, 'ResourcePicker')
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(<ResourcePicker />)
    ensure.missingProps('ResourcePicker', [
      'title',
      'onExitedObjectPicker',
      'isMultiSelect',
      'allowedTypes'
    ])
  })

  it('has typed props', () => {
    shallow(
      <ResourcePicker
        title={123}
        onExitedObjectPicker="foo"
        allowedTypes={{}}
        isMultiSelect="boolean"
      />
    )
    ensure.invalidProps('ResourcePicker', [
      'title',
      'onExitedObjectPicker',
      'isMultiSelect',
      'allowedTypes'
    ])
  })

  it('renders a link button', () => {
    const picker = mount(
      <ResourcePicker
        title="Picker"
        onExitedObjectPicker={()=> {}}
        allowedTypes={['files']}
        isMultiSelect={false}
      />
    )

    ensure.propTypesOk()
    ensure.equal(picker.find('a').length, 1, 'has button link')
  })

})
