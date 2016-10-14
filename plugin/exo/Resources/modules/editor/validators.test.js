import validate from './validators'
import {ensure} from './test-utils'

describe('quiz validator', () => {
  it('returns no errors on valid quiz', () => {
    const quiz = {
      title: 'foo',
      parameters: {
        pick: 1,
        duration: 2,
        maxAttempts: 3
      }
    }
    ensure.equal(validate.quiz(quiz), {
      title: undefined,
      parameters: {
        pick: undefined,
        duration: undefined,
        maxAttempts: undefined
      }
    })
  })

  it('returns validation errors if invalid', () => {
    const quiz = {
      title: null,
      parameters: {
        pick: null,
        duration: 'foo',
        maxAttempts: -3
      }
    }
    ensure.equal(validate.quiz(quiz), {
      title: 'This value should not be blank.',
      parameters: {
        pick: 'This value should not be blank.',
        duration: 'This value should be a valid number.',
        maxAttempts: 'This value should be 0 or more.'
      }
    })
  })
})

describe('step validator', () => {
  it('returns no errors on valid step', () => {
    const step = {
      parameters: {
        maxAttempts: 3
      }
    }
    ensure.equal(validate.step(step), {
      parameters: {
        maxAttempts: undefined
      }
    })
  })

  it('returns validation errors if invalid', () => {
    const step = {
      parameters: {
        maxAttempts: -3
      }
    }
    ensure.equal(validate.step(step), {
      parameters: {
        maxAttempts: 'This value should be 0 or more.'
      }
    })
  })
})
