import React from 'react'
import {mount} from 'enzyme'
import freeze from 'deep-freeze'
import {spyConsole, renew, ensure} from './../../utils/test'
import {lastId} from './../../utils/utils'
import {actions} from './../../quiz/editor/actions'
import editor, {actions as subActions} from './editor'
import {MODE_RECT, MODE_CIRCLE} from './enums'
import {Graphic} from './editor.jsx'

describe('Graphic reducer', () => {
  it('creates a default item and hidden editor props on creation', () => {
    const item = freeze({
      id: '1',
      type: 'application/x.graphic+json',
      content: 'Question?'
    })
    const reduced = editor.reduce(
      item,
      actions.createItem('1', 'application/x.graphic+json')
    )
    ensure.equal(reduced, {
      id: '1',
      type: 'application/x.graphic+json',
      content: 'Question?',
      image: {
        id: lastId(),
        type: '',
        url: '',
        width: 0,
        height: 0
      },
      pointers: 0,
      solutions: [],
      _editor: {
        mode: MODE_RECT
      }
    })
  })

  it('updates the editor mode', () => {
    const item = freeze({
      id: '1',
      type: 'application/x.graphic+json',
      content: 'Question?',
      image: {
        id: 'ID',
        type: '',
        url: '',
        width: 0,
        height: 0
      },
      pointers: 0,
      solutions: [],
      _editor: {
        mode: MODE_RECT
      }
    })
    const reduced = editor.reduce(item, subActions.selectMode(MODE_CIRCLE))
    ensure.equal(reduced, {
      id: '1',
      type: 'application/x.graphic+json',
      content: 'Question?',
      image: {
        id: 'ID',
        type: '',
        url: '',
        width: 0,
        height: 0
      },
      pointers: 0,
      solutions: [],
      _editor: {
        mode: MODE_CIRCLE
      }
    })
  })
})

describe('<Graphic/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(Graphic, 'Graphic')
  })
  afterEach(spyConsole.restore)

  it('renders an empty image zone by default', () => {
    const graphic = mount(
      <Graphic
        item={{
          image: {url: ''},
          _editor: {mode: MODE_CIRCLE}
        }}
        onChange={() => {}}
      />
    )
    ensure.propTypesOk()
    ensure.equal(graphic.find('.img-dropzone').length, 1)
    ensure.equal(graphic.find('.img-dropzone img').length, 0)
  })
})
