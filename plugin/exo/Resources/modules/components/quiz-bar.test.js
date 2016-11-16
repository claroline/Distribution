import React from 'react'
import {shallow, mount} from 'enzyme'
import {spyConsole, renew, ensure, mockTranslator} from './../utils/test'
import {QuizBar} from './quiz-bar.jsx'

describe('<QuizBar/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(QuizBar, 'QuizBar')
    mockTranslator()
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(<QuizBar/>)
    ensure.missingProps(
      'QuizBar',
      ['empty', 'published']
    )
  })

  it('has typed props', () => {
    shallow(
      <QuizBar
        empty={[]}
        published={{}}
      />
    )
    ensure.invalidProps(
      'QuizBar',
      ['empty', 'published']
    )
  })

  it('renders a navbar', () => {
    const navbar = mount(
      <QuizBar
        empty={true}
        published={false}
      />
    )
    ensure.propTypesOk()
    ensure.equal(navbar.find('nav').length, 1)
  })
})
