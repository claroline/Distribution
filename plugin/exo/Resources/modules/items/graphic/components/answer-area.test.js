import React from 'react'
import {shallow} from 'enzyme'
import {spyConsole, renew, ensure} from './../../../utils/test'
import {CircleArea, RectArea} from './answer-areas.jsx'

describe('<CircleArea/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(CircleArea, 'CircleArea')
  })
  afterEach(spyConsole.restore)

  it('renders a circular area', () => {
    const circleArea = shallow(
      <CircleArea
        id="ID"
        color="yellow"
        center={{x: 50, y: 90}}
        radius={20}
        selected={true}
        onSelect={() => {}}
      />
    )
    ensure.propTypesOk()
    ensure.equal(circleArea.name(), 'span')
    ensure.equal(circleArea.hasClass('circle'), true)
  })
})

describe('<RectArea/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(RectArea, 'RectArea')
  })
  afterEach(spyConsole.restore)

  it('renders a rectangular area', () => {
    const rectArea = shallow(
      <RectArea
        id="ID"
        color="blue"
        coords={[
          {x: 50, y: 90},
          {x: 80, y: 140}
        ]}
        selected={true}
        onSelect={() => {}}
      />
    )
    ensure.propTypesOk()
    ensure.equal(rectArea.name(), 'span')
    ensure.equal(rectArea.hasClass('rect'), true)
  })
})
