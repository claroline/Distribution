import React from 'react'
import {shallow, mount} from 'enzyme'
import {spyConsole, renew, ensure} from './../test-utils'
import {Choice} from './choice.jsx'

describe('<Choice/>', () => {
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

// describe('Choice reducer', () => {
//   it('augments base question with specific properties on creation', () => {
//
//   })
// })
