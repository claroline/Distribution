import React from 'react'
import {shallow, mount} from 'enzyme'
import {spyConsole, renew, ensure, mockTranslator} from './../utils/test'
import {QuizOverview} from './quiz-overview.jsx'
import {
  QUIZ_SUMMATIVE,
  SHUFFLE_ALWAYS,
  SHOW_CORRECTION_AT_DATE,
  SHOW_SCORE_AT_CORRECTION
} from './../enums'

describe('<QuizOverview/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(QuizOverview, 'QuizOverview')
    mockTranslator()
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(<QuizOverview parameters={{}}/>)
    ensure.missingProps(
      'QuizOverview',
      ['empty', 'editable', 'created', 'parameters.showMetadata']
    )
  })

  it('has typed props', () => {
    shallow(
      <QuizOverview
        empty={[]}
        editable={{}}
        created={123}
        parameters={true}
      />
    )
    ensure.invalidProps(
      'QuizOverview',
      ['empty', 'editable', 'created', 'parameters']
    )
  })

  it('renders an expandable table with quiz properties', () => {
    const overview = mount(
      <QuizOverview
        empty={true}
        editable={true}
        created="2014/02/03"
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
