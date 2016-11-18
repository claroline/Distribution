import React from 'react'
import {shallow, mount} from 'enzyme'
import {spyConsole, renew, ensure, mockTranslator} from './../../utils/test'
import {Overview} from './overview.jsx'
import {
  QUIZ_SUMMATIVE,
  SHUFFLE_ALWAYS,
  SHOW_CORRECTION_AT_DATE,
  SHOW_SCORE_AT_CORRECTION
} from './../enums'

describe('<Overview/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(Overview, 'Overview')
    mockTranslator()
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(<Overview parameters={{}}/>)
    ensure.missingProps(
      'Overview',
      [
        'empty',
        'editable',
        'created',
        'description',
        'parameters.showMetadata'
      ]
    )
  })

  it('has typed props', () => {
    shallow(
      <Overview
        empty={[]}
        editable={{}}
        created={123}
        description={456}
        parameters={true}
      />
    )
    ensure.invalidProps(
      'Overview',
      [
        'empty',
        'editable',
        'created',
        'description',
        'parameters'
      ]
    )
  })

  it('renders an expandable table with quiz properties', () => {
    const overview = mount(
      <Overview
        empty={true}
        editable={true}
        created="2014/02/03"
        description="DESC"
        parameters={{
          type: QUIZ_SUMMATIVE,
          showMetadata: true,
          randomOrder: SHUFFLE_ALWAYS,
          randomPick: SHUFFLE_ALWAYS,
          pick: 3,
          duration: 0,
          maxAttempts: 5,
          interruptible: true,
          showCorrectionAt: SHOW_CORRECTION_AT_DATE,
          correctionDate: '2015/05/12',
          anonymous: true,
          showScoreAt: SHOW_SCORE_AT_CORRECTION
        }}
      />
    )
    ensure.propTypesOk()
    ensure.equal(overview.find('table').length, 1)
    ensure.equal(overview.find('tr').length, 2)
    ensure.equal(overview.find('td').at(0).text(), '2015/05/12')

    const toggle = overview.find('.toggle-exercise-info')
    toggle.simulate('click')
    ensure.equal(overview.find('tr').length, 10)
  })
})
