import React from 'react'
import freeze from 'deep-freeze'
import merge from 'lodash/merge'
import {shallow, mount} from 'enzyme'
import {spyConsole, renew, ensure, mockTranslator} from './../test-utils'
import {actions as actions} from './../actions'
import definition, {actions as subActions} from './set'
import {lastId, lastIds} from './../util'

describe('Set reducer', () => {
  const reduce = definition.reduce

  it('augments and decorates base question on creation', () => {
    const item = {
      id: '1',
      type: 'application/x.set+json',
      content: 'Question?'
    }
    const reduced = reduce(item, actions.createItem('1', 'application/x.set+json'))
    const ids = lastIds(2)
    ensure.equal(reduced, {
      id: '1',
      type: 'application/x.set+json',
      content: 'Question?',
      random: false,
      penalty: 0,
      sets: [
        {
          id: ids[0],
          type: 'text/html',
          data: '',
          _deletable: false
        }
      ],
      items: [
        {
          id: ids[1],
          type: 'text/html',
          data: '',
          _deletable: false
        }
      ],
      solutions: {
        associations:[],
        odd:[]
      }
    })
  })
  // ITEM base properties
  it('updates random base propertie and marks it as touched', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.updateProperty('random', true))
    const expected = makeFixture({random: true, _touched: {random: true}})
    ensure.equal(reduced, expected)
  })

  it('updates penalty base propertie and marks it as touched', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.updateProperty('penalty', 1))
    const expected = makeFixture({penalty: 1, _touched: {penalty: true}})
    ensure.equal(reduced, expected)
  })

  it('sanitizes incoming data', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.updateProperty('penalty', '1'))
    const expected = makeFixture({penalty: 1, _touched: {penalty: true}})
    ensure.equal(reduced, expected)
  })

  // ITEMS
  it('adds an item when asked and update _deletable property', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.addItem(false))
    const expected = makeFixture({
      items: [
        {}, {}, {},
        {
          id: lastId(),
          type: 'text/html',
          data: '',
          _deletable: true
        }
      ]
    })
    ensure.equal(reduced, expected)
  })

  it('updates item data and concerned association', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.updateItem('1', 'data', 'ABC', false))

    const expected = makeFixture(
      {
        items: [
          {data: 'ABC'}, {}, {}
        ],
        solutions:{
          associations:[
            {_itemData: 'ABC'}
          ]
        },
        _itemsTouched: {data: true}
      }
    )
    ensure.equal(reduced, expected)
  })

  it('removes an item when asked, update items _deletable property and removes ref from associations', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.removeItem('1', false))
    const expected = makeFixture({}, false)
    expected.items.splice(0, 1)
    // two items left but only one is a normal item (the other one is an odd) so _deletable must be set to false
    expected.items[0]._deletable = false
    expected.solutions.associations.splice(0, 1)
    ensure.equal(reduced, expected)
  })

  // ODDS
  it('adds an odd when asked', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.addItem(true))
    const expected = makeFixture({
      items: [
        {}, {}, {},
        {
          id: lastId(),
          type: 'text/html',
          data: ''
        }
      ],
      solutions :{
        odd:[
          {},
          {
            itemId: lastId(),
            score:0,
            feedback: ''
          }
        ]
      }
    })
    ensure.equal(reduced, expected)
  })

  it('updates odd item data and mark odd as touched', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.updateItem('3', 'data', 'ABC', true))

    const expected = makeFixture(
      {
        items: [
          {}, {}, {data: 'ABC'}
        ],
        _oddTouched: {data: true}
      }
    )
    ensure.equal(reduced, expected)
  })

  it('removes an odd item when asked and removes its ref from solutions.odd', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.removeItem('3', true))
    const expected = makeFixture({}, false)
    expected.items.splice(2, 1)
    expected.solutions.odd.splice(0, 1)
    ensure.equal(reduced, expected)
  })

  // SET
  it('adds a set when asked', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.addSet())
    const expected = makeFixture({
      sets: [
        {}, {},
        {
          id: lastId(),
          type: 'text/html',
          data: '',
          _deletable: true
        }
      ]
    })
    ensure.equal(reduced, expected)
  })

  it('removes a set when asked update _deletable property and removes all concerned associations', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.removeSet('2'))
    const expected = makeFixture({}, false)
    expected.sets.splice(1, 1)
    expected.sets[0]._deletable = false
    expected.solutions.associations.splice(0, 1)
    ensure.equal(reduced, expected)
  })

  it('updates set data and mark set as touched', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.updateSet('1', 'data', 'ABC'))

    const expected = makeFixture(
      {
        sets: [
          {data: 'ABC'}, {}
        ],
        _setTouched: {data: true}
      }
    )
    ensure.equal(reduced, expected)
  })

  // SOLUTIONS.ASSOCIATIONS
  it('adds a solution association when asked', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.addAssociation('1', '1', 'A'))
    const expected = makeFixture({
      solutions: {
        associations: [
          {},
          {
            setId: '1',
            itemId: '1',
            score: 1,
            feedback: '',
            _itemData: 'A'
          }
        ]
      }
    })
    ensure.equal(reduced, expected)
  })

  it('updates solution association score and mark association as touched', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.updateAssociation('2', '1', 'score', 2))
    const expected = makeFixture({
      solutions: {
        associations: [
          {score: 2}
        ]
      },
      _associationTouched: {score: true}
    })
    ensure.equal(reduced, expected)
  })

  it('updates solution association feedback and mark association as touched', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.updateAssociation('2', '1', 'feedback', 'FEEDBACK'))
    const expected = makeFixture({
      solutions: {
        associations: [
          {feedback: 'FEEDBACK'}
        ]
      },
      _associationTouched: {feedback: true}
    })
    ensure.equal(reduced, expected)
  })

  // SOLUTIONS.ODD
  it('updates solution odd score and mark odd as touched', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.updateItem('3', 'score', -5, true))
    const expected = makeFixture({
      solutions: {
        odd: [
          {score: -5}
        ]
      },
      _oddTouched: {score: true}
    })
    ensure.equal(reduced, expected)
  })

  it('updates solution odd feedback and mark odd as touched', () => {
    const item = makeFixture()
    const reduced = reduce(item, subActions.updateItem('3', 'feedback', 'FEEDBACK', true))
    const expected = makeFixture({
      solutions: {
        odd: [
          {feedback: 'FEEDBACK'}
        ]
      },
      _oddTouched: {feedback: true}
    })
    ensure.equal(reduced, expected)
  })
})

describe('Set validator', () => {
  before(mockTranslator)
  const validate = definition.validate

  it('checks set penalty validity', () => {
    const item = makeFixture({
      penalty: 'ABC'
    })
    const errors = validate(item)
    ensure.equal(errors, {
      item: 'set_penalty_not_valid'
    })
  })

  it('checks that at least one item that is not an odd exists', () => {
    const item = makeFixture({
      items: [{}, {}, {}]
    }, false)
    item.items.splice(0, 2)
    const errors = validate(item)
    ensure.equal(errors, {
      items: 'set_at_least_one_item'
    })
  })

  it('checks items data are not empty', () => {
    const item = makeFixture({
      items: [{}, {data:''}, {}]
    })
    const errors = validate(item)
    ensure.equal(errors, {
      items: 'set_item_empty_data_error'
    })
  })

  it('checks that at least one set exists', () => {
    const item = makeFixture({
      sets: [{}, {}]
    }, false)
    item.sets.splice(0, 2)
    const errors = validate(item)
    ensure.equal(errors, {
      sets: 'set_at_least_one_set'
    })
  })

  it('checks that set data is not empty', () => {
    const item = makeFixture({
      sets: [{}, {data:''}]
    })
    const errors = validate(item)
    ensure.equal(errors, {
      sets: 'set_set_empty_data_error'
    })
  })

  it('checks that at least one solutions association exists', () => {
    const item = makeFixture({}, false)
    item.solutions.associations.splice(0, 1)
    const errors = validate(item)
    ensure.equal(errors, {
      solutions: 'set_no_solution'
    })
  })

  it('checks that at least one solutions association score is a valid number exists', () => {
    const item = makeFixture(
      {
        solutions:{
          associations: [
            {score: 'not a number'}
          ]
        }
      }
    )
    const errors = validate(item)
    ensure.equal(errors, {
      solutions: 'set_score_not_valid'
    })
  })

  it('checks that at least one solutions association with a score that is greater than 0 exists', () => {
    const item = makeFixture(
      {
        solutions:{
          associations: [
            {score: -2}
          ]
        }
      }
    )
    const errors = validate(item)
    ensure.equal(errors, {
      solutions: 'set_no_valid_solution'
    })
  })

  it('returns no errors if item is valid', () => {
    const item = makeFixture()
    const errors = validate(item)
    ensure.equal(errors, {})
  })
})

describe('<Set />', () => {
  const Set = definition.component

  beforeEach(() => {
    spyConsole.watch()
    renew(Set, 'Set')
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(<Set item={{items:[], sets:[], solutions:{}}}/>)
    ensure.missingProps('Set', ['onChange', 'item.id'])
  })

  it('has typed props', () => {
    shallow(
      <Set
        item={
          {
            id: [],
            penalty: 'a',
            random: [],
            items:[],
            sets: [],
            solutions: {},
            _errors: {}
          }
        }
        onChange={false}
      />
    )
    ensure.invalidProps('Set', ['item.id', 'onChange'])
  })

  /*it('renders appropriate fields and handle changes', () => {
    let updatedValue = null
    const item = makeFixture()

    const form = mount(
      <Set
        item={item}
        onChange={value => updatedValue = value}
      />
    )
    ensure.propTypesOk()

    const penalty = form.find('input#set-penalty')
    ensure.equal(penalty.length, 1, 'has penalty input')
    penalty.simulate('change', {target: {value: 5}})
    ensure.equal(updatedValue.value, 5)
    ensure.equal(updatedValue.property, 'penalty')

    const random = form.find('input[type="checkbox"]')
    ensure.equal(random.length, 1, 'has random checkbox')
    random.simulate('change', {target: {value: true}})
    ensure.equal(updatedValue.value, true)
    ensure.equal(updatedValue.property, 'random')

  })*/
})


function makeFixture(props = {}, frozen = true) {
  const fixture = merge({
    id: '1',
    type: 'application/x.set+json',
    content: 'Question?',
    random: false,
    penalty: 0,
    sets: [
      {
        id: '1',
        type: 'text/html',
        data: 'A',
        _deletable: true
      },
      {
        id: '2',
        type: 'text/html',
        data: 'B',
        _deletable: true
      }
    ],
    items: [
      {
        id: '1',
        type: 'text/html',
        data: 'C',
        _deletable: true
      },
      {
        id:'2',
        type: 'text/html',
        data: 'D',
        _deletable: true
      },
      {
        id:'3',
        type: 'text/html',
        data: 'E'
      }
    ],
    solutions: {
      associations: [
        {
          itemId: '1',
          setId: '2',
          score: 3,
          feedback: '',
          _itemData: 'C'
        }
      ],
      odd: [
        {
          itemId:'3',
          score: -1,
          feedback: 'Wrong answer'
        }
      ]
    }
  }, props)

  return frozen ? freeze(fixture) : fixture
}
