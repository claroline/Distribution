import freeze from 'deep-freeze'
import {assertEqual} from './test-utils'
import {TYPE_QUIZ, SCORE_SUM, SCORE_FIXED} from './enums'
import {decorate} from './decorator'

describe('Decorator', () => {
  it('adds editor state sections and convenience fields to quiz state', () => {
    const state = freeze({
      quiz: {
        id: '1',
        steps: ['a', 'b']
      },
      steps: {
        a: {
          id: 'a',
          items: ['x', 'y']
        },
        b: {
          id: 'b',
          items: ['z']
        }
      },
      items: {
        x: {
          id: 'x',
          type: 'foo/bar'
        },
        y: {
          id: 'y',
          type: 'bar/quz',
          score: {
            type: SCORE_FIXED,
            success: 5,
            failure: 2
          }
        },
        z: {
          id: 'z',
          type: 'text/html'
        }
      }
    })
    assertEqual(decorate(state), {
      quiz: {
        id: '1',
        steps: ['a', 'b'],
        _errors: {
          parameters: {}
        },
        _touched: {
          parameters: {}
        }
      },
      steps: {
        a: {
          id: 'a',
          items: ['x', 'y'],
          _errors: {
            parameters: {}
          },
          _touched: {
            parameters: {}
          }
        },
        b: {
          id: 'b',
          items: ['z'],
          _errors: {
            parameters: {}
          },
          _touched: {
            parameters: {}
          }
        }
      },
      items: {
        x: {
          id: 'x',
          type: 'foo/bar',
          score: {
            type: SCORE_SUM,
            success: 1,
            failure: 0
          },
          _errors: {
            score: {}
          },
          _touched: {
            score: {}
          }
        },
        y: {
          id: 'y',
          type: 'bar/quz',
          score: {
            type: SCORE_FIXED,
            success: 5,
            failure: 2
          },
          _errors: {
            score: {}
          },
          _touched: {
            score: {}
          }
        },
        z: {
          id: 'z',
          type: 'text/html',
          score: {
            type: SCORE_SUM,
            success: 1,
            failure: 0
          },
          _errors: {
            score: {}
          },
          _touched: {
            score: {}
          }
        }
      },
      currentObject: {
        id: state.quiz.id,
        type: TYPE_QUIZ
      }
    })
  })

  it('calls available decorator for each item type', () => {
    const state = freeze({
      quiz: {
        id: '1',
        steps: ['a']
      },
      steps: {
        a: {
          id: 'a',
          items: ['x']
        }
      },
      items: {
        x: {
          id: 'x',
          type: 'application/foo.bar+json'
        }
      }
    })
    const itemDecorators = {
      'application/foo.bar+json': item => {
        return Object.assign({}, item, {
          _foo: `${item.id}-bar`
        })
      }
    }
    assertEqual(decorate(state, itemDecorators), {
      quiz: {
        id: '1',
        steps: ['a'],
        _errors: {
          parameters: {}
        },
        _touched: {
          parameters: {}
        }
      },
      steps: {
        a: {
          id: 'a',
          items: ['x'],
          _errors: {
            parameters: {}
          },
          _touched: {
            parameters: {}
          }
        }
      },
      items: {
        x: {
          id: 'x',
          type: 'application/foo.bar+json',
          score: {
            type: SCORE_SUM,
            success: 1,
            failure: 0
          },
          _foo: 'x-bar',
          _errors: {
            score: {}
          },
          _touched: {
            score: {}
          }
        }
      },
      currentObject: {
        id: state.quiz.id,
        type: TYPE_QUIZ
      }
    })
  })
})
