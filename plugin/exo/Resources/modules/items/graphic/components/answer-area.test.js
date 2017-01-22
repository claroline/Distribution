import React from 'react'
import {shallow} from 'enzyme'
import {spyConsole, renew, ensure} from './../../../utils/test'
import {SHAPE_RECT, SHAPE_CIRCLE} from './../enums'
import {AnswerArea} from './answer-area.jsx'

describe('<AnswerArea/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(AnswerArea, 'AnswerArea')
  })
  afterEach(spyConsole.restore)

  it('renders rectangular or circular areas', () => {
    const rectArea = shallow(
      <AnswerArea
        color="yellow"
        shape={SHAPE_RECT}
        coords={[
          {x: 0, y: 0},
          {x: 100, y: 50}
        ]}
      />
    )
    const circArea = shallow(
      <AnswerArea
        color="black"
        shape={SHAPE_CIRCLE}
        coords={[{x: 100, y: 50}]}
        radius={30}
      />
    )
    ensure.propTypesOk()
    ensure.equal(circArea.name(), 'span')
    ensure.equal(circArea.hasClass('circle'), true)
    ensure.equal(rectArea.name(), 'span')
    ensure.equal(rectArea.hasClass('rect'), true)
  })
})
