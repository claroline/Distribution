import React from 'react'
import {shallow} from 'enzyme'
import {spyConsole, renew, ensure} from './../../../utils/test'
import {AnswerArea as BaseArea} from './answer-area.jsx'
import {SHAPE_CIRCLE, SHAPE_RECT} from './../enums'

// see https://react-dnd.github.io/react-dnd/docs-testing.html
const AnswerArea = BaseArea.DecoratedComponent

describe('<AnswerArea/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(AnswerArea, 'AnswerArea')
  })
  afterEach(spyConsole.restore)

  it('renders a circular area', () => {
    const area = shallow(
      <AnswerArea
        id="ID"
        color="yellow"
        shape={SHAPE_CIRCLE}
        geometry={{
          center: {x: 50, y: 90},
          radius: 20
        }}
        selected={true}
        isDragging={false}
        onSelect={() => {}}
        onDelete={() => {}}
        togglePopover={() => {}}
        connectDragSource={el => el}
      />
    )
    ensure.propTypesOk()
  })

  it('renders a rectangular area', () => {
    const area = shallow(
      <AnswerArea
        id="ID"
        color="blue"
        shape={SHAPE_RECT}
        geometry={{
          coords: [
            {x: 50, y: 90},
            {x: 80, y: 140}
          ]
        }}
        selected={true}
        isDragging={false}
        onSelect={() => {}}
        onDelete={() => {}}
        togglePopover={() => {}}
        connectDragSource={el => el}
      />
    )
    ensure.propTypesOk()
  })
})
