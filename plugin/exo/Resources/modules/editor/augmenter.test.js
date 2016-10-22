import freeze from 'deep-freeze'
import {assertEqual} from './test-utils'
import {TYPE_QUIZ} from './enums'
import {augment} from './augmenter'

describe('Augmenter', () => {
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
          type: 'bar/quz'
        },
        z: {
          id: 'z',
          type: 'text/html'
        }
      }
    })
    assertEqual(augment(state), {
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
          _errors: {},
          _touched: {}
        },
        y: {
          id: 'y',
          type: 'bar/quz',
          _errors: {},
          _touched: {}
        },
        z: {
          id: 'z',
          type: 'text/html',
          _errors: {},
          _touched: {}
        }
      },
      currentObject: {
        id: state.quiz.id,
        type: TYPE_QUIZ
      }
    })
  })

  it('calls available augmenter for each item type', () => {
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
    const itemAugmenters = {
      'application/foo.bar+json': item => {
        return Object.assign({}, item, {
          _foo: `${item.id}-bar`
        })
      }
    }
    assertEqual(augment(state, itemAugmenters), {
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
          _foo: 'x-bar',
          _errors: {},
          _touched: {}
        }
      },
      currentObject: {
        id: state.quiz.id,
        type: TYPE_QUIZ
      }
    })
  })
})
