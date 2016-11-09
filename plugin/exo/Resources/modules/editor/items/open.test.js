import React from 'react'
import freeze from 'deep-freeze'
import merge from 'lodash/merge'
import {shallow, mount} from 'enzyme'
import {spyConsole, renew, ensure, mockTranslator} from './../test-utils'
import {actions as actions} from './../actions'
import definition, {actions as subActions} from './open'

describe('Open reducer', () => {
  const reduce = definition.reduce

  it('augments and decorates base question on creation', () => {
    const item = {
      id: '1',
      type: 'application/x.open+json',
      content: 'Question?'
    }
    const reduced = reduce(item, actions.createItem('1', 'application/x.open+json'))
    ensure.equal(reduced, {
      id: '1',
      type: 'application/x.open+json',
      content: 'Question?',
      maxLength: 0,
      maxScore: 0
    })
  })

  it('updates base properties and marks them as touched', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.update('maxLength', 255))
    const expected = makeFixture({maxLength: 255, _touched: {maxLength: true}})
    ensure.equal(reduced, expected)
  })

  it('sanitizes incoming data', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.update('maxScore', '10'))
    const expected = makeFixture({
      maxScore: 10,
      _touched: {
        maxScore: true
      }
    })
    ensure.equal(reduced, expected)
  })
})

describe('Open validator', () => {
  before(mockTranslator)

  const validate = definition.validate

  it('checks maxScore is greater or equal to zero', () => {
    const errors = validate({
      maxScore: -1,
      maxLength:0
    })
    ensure.equal(errors, {
      maxScore: 'This value should be 0 or more.'
    })
  })

  it('checks maxScore is not empty', () => {
    const errors = validate({
      maxScore: '',
      maxLength:0
    })
    ensure.equal(errors, {
      maxScore: 'This value should not be blank.'
    })
  })

  it('checks maxScore is a number', () => {
    const errors = validate({
      maxScore: [],
      maxLength:0
    })
    ensure.equal(errors, {
      maxScore: 'This value should be a valid number.'
    })
  })

  it('checks maxLength is greater or equal to zero', () => {
    const errors = validate({
      maxScore: 0,
      maxLength: -1
    })
    ensure.equal(errors, {
      maxLength: 'This value should be 0 or more.'
    })
  })

  it('checks maxLength is not empty', () => {
    const errors = validate({
      maxScore: 0,
      maxLength: null
    })
    ensure.equal(errors, {
      maxLength: 'This value should not be blank.'
    })
  })

  it('checks maxLength is a number', () => {
    const errors = validate({
      maxScore: 0,
      maxLength:[]
    })
    ensure.equal(errors, {
      maxLength: 'This value should be a valid number.'
    })
  })

  it('returns no errors if item is valid', () => {
    const errors = validate({
      maxScore: 0,
      maxLength:0
    })
    ensure.equal(errors, {})
  })
})

describe('<Open/>', () => {
  const Open = definition.component

  beforeEach(() => {
    spyConsole.watch()
    renew(Open, 'Open')
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(<Open item={{foo:'baz'}}/>)
    ensure.missingProps('Open', ['onChange', 'item.id'])
  })

  it('has typed props', () => {
    shallow(
      <Open
        item={{
          id: [],
          maxScore: [],
          maxLength: []
        }}
        onChange={false}
      />
    )
    ensure.invalidProps('Open', ['item.id', 'onChange'])
  })

  it('renders appropriate fields and handle changes', () => {
    let updatedValue = null

    const form = mount(
      <Open
        item={{
          id: '1',
          content: 'Question?',
          maxLength: 255,
          maxScore: 10
        }}
        onChange={value => updatedValue = value}
      />
    )
    ensure.propTypesOk()

    const maxScore = form.find('input#item-1-maxScore')
    ensure.equal(maxScore.length, 1, 'has maxScore input')
    maxScore.simulate('change', {target: {value: 10}})
    ensure.equal(updatedValue.value, 10)
    ensure.equal(updatedValue.property, 'maxScore')

    const maxLength = form.find('input#item-1-maxLength')
    ensure.equal(maxLength.length, 1, 'has maxLength input')
    maxLength.simulate('change', {target: {value: 255}})
    ensure.equal(updatedValue.value, 255)
    ensure.equal(updatedValue.property, 'maxLength')
  })
})

function makeFixture(props = {}, frozen = true) {
  const fixture = merge({
    id: '1',
    type: 'application/x.open+json',
    content: 'Question?',
    maxScore: 0,
    maxLength: 0
  }, props)

  return frozen ? freeze(fixture) : fixture
}
