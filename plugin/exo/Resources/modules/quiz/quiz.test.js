import assert from 'assert'
import freeze from 'deep-freeze'
import {resetTypes} from './../items/item-types'
import {spyConsole} from './../utils/test'
import {Quiz} from './quiz'

describe('Quiz', () => {
  beforeEach(spyConsole.watch)

  afterEach(() => {
    spyConsole.restore()
    resetTypes()
  })

  it('takes raw quiz data and renders a full quiz', () => {
    const quiz = new Quiz(quizFixture())
    const element = document.createElement('div')
    window.Routing = {
      generate: () => {}
    }
    quiz.render(element)
    // this is just a rough test to check main components have been rendered
    assert(element.querySelector('.quiz-editor'), 'a .quiz-editor element is present')
    assert(element.querySelector('.thumbnail-box'), 'a .thumbnail-box element is present')
    assert(element.querySelector('.edit-zone'), 'an .edit-zone element is present')
  })
})

function quizFixture() {
  return freeze({
    id: '1',
    title: 'Quiz title',
    description: 'Quiz desc',
    parameters: {},
    steps: [
      {
        id: 'a',
        parameters: {},
        items: [
          {
            id: 'x',
            type: 'application/x.choice+json',
            choices: [],
            solutions: []
          },
          {
            id: 'y',
            type: 'application/x.open+json'
          }
        ]
      },
      {
        id: 'b',
        parameters: {},
        items: [
          {
            id: 'z',
            type: 'text/html'
          }
        ]
      }
    ]
  })
}
