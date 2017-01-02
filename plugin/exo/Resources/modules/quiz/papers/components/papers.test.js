import React from 'react'
import {shallow} from 'enzyme'
import {spyConsole, renew, ensure, mockTranslator} from './../../utils/test'
import {Papers} from './papers.jsx'

describe('<Papers/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(Papers, 'Papers')
    mockTranslator()
  })
  afterEach(spyConsole.restore)

  it('renders a list of papers', () => {
    shallow(<Papers/>)
    ensure.propTypesOk()
  })
})
