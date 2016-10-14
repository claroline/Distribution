import sanitize from './sanitizers'
import {ensure} from './test-utils'

describe('sanitize quiz', () => {
  it('converts numeric fields to integers', () => {
    const quiz = {
      title: 'foo',
      parameters: {
        duration: '12',
        pick: '34',
        maxAttempts: '56'
      }
    }
    ensure.equal(sanitize.quiz(quiz), {
      title: 'foo',
      parameters: {
        duration: 12,
        pick: 34,
        maxAttempts: 56
      }
    })
  })
})

describe('sanitize step', () => {
  it('converts numeric fields to integers', () => {
    const step = {
      title: 'foo',
      parameters: {
        maxAttempts: '123'
      }
    }
    ensure.equal(sanitize.step(step), {
      title: 'foo',
      parameters: {
        maxAttempts: 123
      }
    })
  })
})
