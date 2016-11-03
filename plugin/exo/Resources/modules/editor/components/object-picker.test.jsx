import React from 'react'
import {shallow} from 'enzyme'
import {spyConsole, renew, ensure} from './../test-utils'
import {ObjectPicker} from './object-picker.jsx'

describe('<ObjectPicker/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(ObjectPicker, 'ObjectPicker')
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(<ObjectPicker />)
    ensure.missingProps('ObjectPicker', [
      'title',
      'onExitedObjectPicker'
    ])
  })

  it('has typed props', () => {
    shallow(
      <ObjectPicker
        title={123}
        onExitedObjectPicker="foo"
      />
    )
    ensure.invalidProps('ItemForm', [
      'title',
      'onExitedObjectPicker'
    ])
  })
})
