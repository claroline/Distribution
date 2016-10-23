import React from 'react'
import freeze from 'deep-freeze'
import {shallow, mount} from 'enzyme'
import {spyConsole, renew, ensure} from './../test-utils'
import {lastIds} from './../util'
import {actions} from './../actions'
import definition from './choice'

describe('Choice reducer', () => {
  const reduce = definition.reduce

  it('sets choice properties and decorates base question on creation', () => {
    const item = {
      id: '1',
      type: 'application/x.choice+json',
      content: 'Question?'
    }
    const reduced = reduce(item, actions.createItem('1', 'application/x.choice+json'))
    const ids = lastIds(2)
    ensure.equal(reduced, {
      id: '1',
      type: 'application/x.choice+json',
      content: 'Question?',
      multiple: false,
      random: false,
      choices: [
        {
          id: ids[0],
          data: '',
          _score: 1,
          _feedback: '',
          _checked: true,
          _deletable: false,
          _errors: {},
          _touched: {}
        },
        {
          id: ids[1],
          data: '',
          _score: 0,
          _feedback: '',
          _checked: false,
          _deletable: false,
          _errors: {},
          _touched: {}
        }
      ],
      solutions: [
        {
          id: ids[0],
          score: 1,
          feedback: ''
        },
        {
          id: ids[1],
          score: 0,
          feedback: ''
        }
      ]
    })
  })
})

describe('Choice decorator', () => {
  const decorate = definition.decorate

  it('adds solution data and ui flags to choice items', () => {
    const item = freeze({
      id: '1',
      content: 'Question?',
      random: true,
      multiple: true,
      choices: [
        {
          id: '2',
          data: 'Foo'
        },
        {
          id: '3',
          data: 'Bar'
        }
      ],
      solutions: [
        {
          id: '2',
          score: 1,
          feedback: 'Feed foo'
        },
        {
          id: '3',
          score: 0,
          feedback: 'Feed bar'
        }
      ]
    })
    ensure.equal(decorate(item), {
      id: '1',
      content: 'Question?',
      random: true,
      multiple: true,
      choices: [
        {
          id: '2',
          data: 'Foo',
          _score: 1,
          _feedback: 'Feed foo',
          _checked: true,
          _deletable: false,
          _errors: {},
          _touched: {}
        },
        {
          id: '3',
          data: 'Bar',
          _score: 0,
          _feedback: 'Feed bar',
          _checked: false,
          _deletable: false,
          _errors: {},
          _touched: {}
        }
      ],
      solutions: [
        {
          id: '2',
          score: 1,
          feedback: 'Feed foo'
        },
        {
          id: '3',
          score: 0,
          feedback: 'Feed bar'
        }
      ]
    })
  })

  it('adds choice ticks for multiple responses', () => {
    const item = freeze({
      multiple: true,
      choices: [
        {
          id: '1',
          data: 'Foo'
        },
        {
          id: '2',
          data: 'Bar'
        },
        {
          id: '3',
          data: 'Baz'
        }
      ],
      solutions: [
        {
          id: '1',
          score: 1,
          feedback: 'Feed foo'
        },
        {
          id: '2',
          score: 0,
          feedback: 'Feed bar'
        },
        {
          id: '3',
          score: 2,
          feedback: 'Feed bar'
        }
      ]
    })
    const decorated = decorate(item)
    ensure.equal(decorated.choices[0]._checked, true)
    ensure.equal(decorated.choices[1]._checked, false)
    ensure.equal(decorated.choices[2]._checked, true)
  })

  it('adds choice ticks for unique responses', () => {
    const item = freeze({
      multiple: false,
      choices: [
        {
          id: '1',
          data: 'Foo'
        },
        {
          id: '2',
          data: 'Bar'
        },
        {
          id: '3',
          data: 'Baz'
        }
      ],
      solutions: [
        {
          id: '1',
          score: 1,
          feedback: 'Feed foo'
        },
        {
          id: '2',
          score: 0,
          feedback: 'Feed bar'
        },
        {
          id: '3',
          score: 2,
          feedback: 'Feed bar'
        }
      ]
    })
    const decorated = decorate(item)
    ensure.equal(decorated.choices[0]._checked, false)
    ensure.equal(decorated.choices[1]._checked, false)
    ensure.equal(decorated.choices[2]._checked, true)
  })
})

describe('<Choice/>', () => {
  const Choice = definition.component

  beforeEach(() => {
    spyConsole.watch()
    renew(Choice, 'Choice')
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(<Choice item={{score: {}}}/>)
    ensure.missingProps('Choice', ['item.id', 'onChange'])
  })

  it('has typed props', () => {
    shallow(
      <Choice
        item={{
          id: [],
          score: {}
        }}
        onChange={false}
      />
    )
    ensure.invalidProps('Choice', ['item.id', 'onChange'])
  })

  it('renders a list of choices', () => {
    mount(
      <Choice
        item={{
          id: '1',
          content: 'Question?',
          random: true,
          multiple: true,
          choices: [
            {
              id: '2',
              data: 'Foo',
              _score: 1,
              _feedback: 'Feed foo',
              _checked: false,
              _deletable: false,
              _errors: {}
            },
            {
              id: '3',
              data: 'Bar',
              _score: 0,
              _feedback: 'Feed bar',
              _checked: true,
              _deletable: false,
              _errors: {}
            }
          ],
          score: {
            type: 'sum'
          },
          _errors: {}
        }}
        onChange={() => {}}
      />
    )
    ensure.propTypesOk()
  })
})
