import React from 'react'
import {shallow, mount} from 'enzyme'
import {spyConsole, renew, ensure} from './../test-utils'
import {ItemForm} from './item-form.jsx'

describe('<ItemForm/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(ItemForm, 'ItemForm')
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(<ItemForm item={{}}/>)
    ensure.missingProps('ItemForm', [
      'item.id',
      'children',
      'onChange',
      'onHintAdd',
      'onHintRemove',
      'onHintChange'
    ])
  })

  it('has typed props', () => {
    shallow(
      <ItemForm
        item={{id: 123}}
        onChange="foo"
        onHintAdd="bar"
        onHintRemove="baz"
        onHintChange="quz"
      >
        {false}
      </ItemForm>
    )
    ensure.invalidProps('ItemForm', [
      'item.id',
      'children',
      'onChange',
      'onHintAdd',
      'onHintRemove',
      'onHintChange'
    ])
  })

  it('renders a form and dispatches changes', () => {
    let updatedValue = null

    const form = mount(
      <ItemForm
        item={{
          id: 'ID',
          title: 'TITLE',
          description: 'DESC',
          instruction: 'INSTR',
          info: 'INFO',
          content: 'CONTENT',
          hints: [],
          feedback: 'FEEDBACK'
        }}
        onChange={newValue => updatedValue = newValue}
        onHintAdd={() => {}}
        onHintRemove={() => {}}
        onHintChange={() => {}}
      >
        <input value="CHILD"/>
      </ItemForm>
    )

    ensure.propTypesOk()
    ensure.equal(form.find('form').length, 1, 'has form')

    const title = form.find('input#item-ID-title')
    ensure.equal(title.length, 1, 'has title input')
    title.simulate('change', {target: {value: 'FOO'}})
    ensure.equal(updatedValue, {title: 'FOO'})
  })
})
