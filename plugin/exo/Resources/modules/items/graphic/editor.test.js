import React from 'react'
import {mount} from 'enzyme'
import freeze from 'deep-freeze'
import merge from 'lodash/merge'
import {spyConsole, renew, ensure} from './../../utils/test'
import {lastId} from './../../utils/utils'
import {actions} from './../../quiz/editor/actions'
import {actions as subActions} from './actions'
import {
  MODE_RECT,
  MODE_CIRCLE,
  SHAPE_RECT,
  SHAPE_CIRCLE,
  AREA_DEFAULT_SIZE
} from './enums'
import editor from './editor'
import {Graphic} from './editor.jsx'

describe('Graphic reducer', () => {
  it('creates a default item and hidden editor props on creation', () => {
    const item = freeze({
      id: 'ID-ITEM',
      type: 'application/x.graphic+json',
      content: 'Question?'
    })
    const reduced = editor.reduce(
      item,
      actions.createItem('1', 'application/x.graphic+json')
    )
    ensure.equal(reduced, itemFixture({
      image: {
        id: lastId()
      }
    }))
  })

  it('updates the editor mode', () => {
    const item = itemFixture()
    const reduced = editor.reduce(item, subActions.selectMode(MODE_CIRCLE))
    ensure.equal(reduced, itemFixture({
      _mode: MODE_CIRCLE
    }))
  })

  it('updates the image on selection', () => {
    const item = itemFixture()
    const reduced = editor.reduce(item, subActions.selectImage({
      type: 'image/jpeg',
      url: 'foo',
      width: 200,
      height: 100
    }))
    ensure.equal(reduced, itemFixture({
      image: {
        type: 'image/jpeg',
        url: 'foo',
        width: 200,
        height: 100
      }
    }))
  })

  it('creates rectangular areas', () => {
    const item = itemFixture({
      image: {
        id: 'ID',
        type: 'image/png',
        url: 'foo',
        width: 200,
        height: 200
      }
    })
    const reduced = editor.reduce(item, subActions.createArea(80, 90))
    ensure.equal(reduced, itemFixture({
      image: {
        id: 'ID',
        type: 'image/png',
        url: 'foo',
        width: 200,
        height: 200
      },
      pointers: 1,
      solutions: [
        {
          area: {
            id: lastId(),
            shape: SHAPE_RECT,
            coords: [
              {
                x: 80 - (AREA_DEFAULT_SIZE / 2),
                y: 90 - (AREA_DEFAULT_SIZE / 2)
              },
              {
                x: 80 + (AREA_DEFAULT_SIZE / 2),
                y: 90 + (AREA_DEFAULT_SIZE / 2)
              }
            ],
            color: 'blue',
            score: 1,
            feedback: ''
          }
        }
      ]
    }))
  })

  it('creates circular areas', () => {
    const item = itemFixture({
      image: {
        id: 'ID',
        type: 'image/png',
        url: 'foo',
        width: 200,
        height: 200
      },
      _mode: MODE_CIRCLE
    })
    const reduced = editor.reduce(item, subActions.createArea(80, 90))
    ensure.equal(reduced, itemFixture({
      image: {
        id: 'ID',
        type: 'image/png',
        url: 'foo',
        width: 200,
        height: 200
      },
      pointers: 1,
      solutions: [
        {
          area: {
            id: lastId(),
            shape: SHAPE_CIRCLE,
            coords: [{x: 80, y: 90}],
            radius: AREA_DEFAULT_SIZE / 2,
            color: 'blue',
            score: 1,
            feedback: ''
          }
        }
      ],
      _mode: MODE_CIRCLE
    }))
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
          solutions: [],
          _mode: MODE_CIRCLE
        }}
        validating={false}
        onChange={() => {}}
      />
    )
    ensure.propTypesOk()
    ensure.equal(graphic.find('.img-dropzone').length, 1)
    ensure.equal(graphic.find('.img-dropzone img').length, 0)
  })
})

function itemFixture(props = {}) {
  return freeze(merge({
    id: 'ID-ITEM',
    type: 'application/x.graphic+json',
    content: 'Question?',
    image: {
      id: 'ID-IMG',
      type: '',
      url: '',
      width: 0,
      height: 0
    },
    pointers: 0,
    solutions: [],
    _mode: MODE_RECT
  }, props))
}
