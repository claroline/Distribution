import {ITEM_CREATE} from './../../quiz/editor/actions'
import {makeId, makeActionCreator} from './../../utils/utils'
import {tex} from './../../utils/translate'
import {
  MODE_RECT,
  MODE_SELECT,
  MAX_IMG_SIZE,
  SHAPE_RECT,
  SHAPE_CIRCLE,
  AREA_DEFAULT_SIZE
} from './enums'
import {
  SELECT_MODE,
  SELECT_IMAGE,
  RESIZE_IMAGE,
  CREATE_AREA,
  SELECT_AREA,
  MOVE_AREA
} from './actions'
import {Graphic as component} from './editor.jsx'

function reduce(item = {}, action = {}) {
  switch (action.type) {
    case ITEM_CREATE:
      return decorate(Object.assign({}, item, {
        image: blankImage(),
        pointers: 0,
        solutions: []
      }))
    case SELECT_MODE:
      return Object.assign({}, item, {
        _mode: action.mode
      })
    case SELECT_IMAGE:
      return Object.assign({}, item, {
        image: Object.assign(
          blankImage(),
          {id: item.image.id},
          action.image
        )
      })
    case RESIZE_IMAGE: {
      const sizeRatio = item.image.width / action.width
      const toClient = length => Math.round(length / sizeRatio)

      return Object.assign({}, item, {
        image: Object.assign({}, item.image, {
          _clientWidth: action.width,
          _clientHeight: action.height
        }),
        solutions: item.solutions.map(solution => {
          if (solution.area.shape === SHAPE_RECT) {
            return Object.assign({}, solution, {
              area: Object.assign({}, solution.area, {
                coords: solution.area.coords.map(coords => Object.assign({}, coords, {
                  _clientX: toClient(coords.x),
                  _clientY: toClient(coords.y)
                }))
              })
            })
          } else {
            return Object.assign({}, solution, {
              area: Object.assign({}, solution.area, {
                center: Object.assign({}, solution.area.center, {
                  _clientX: toClient(solution.area.center.x),
                  _clientY: toClient(solution.area.center.y)
                }),
                _clientRadius: toClient(solution.area.radius)
              })
            })
          }
        })
      })
    }
    case CREATE_AREA: {
      const clientX = action.x
      const clientY = action.y
      const clientHalfSize = AREA_DEFAULT_SIZE / 2
      const absX = toAbs(clientX, item.image)
      const absY = toAbs(clientY, item.image)
      const absHalfSize = toAbs(clientHalfSize, item.image)
      const area = {
        id: makeId(),
        shape: item._mode === MODE_RECT ? SHAPE_RECT : SHAPE_CIRCLE,
        color: 'blue'
      }

      if (area.shape === SHAPE_CIRCLE) {
        area.center = {
          x: absX,
          y: absY,
          _clientX: clientX,
          _clientY: clientY
        }
        area.radius = absHalfSize
        area._clientRadius = clientHalfSize
      } else {
        area.coords = [
          {
            x: absX - absHalfSize,
            y: absY - absHalfSize,
            _clientX: clientX - clientHalfSize,
            _clientY: clientY - clientHalfSize
          },
          {
            x: absX + absHalfSize,
            y: absY + absHalfSize,
            _clientX: clientX + clientHalfSize,
            _clientY: clientY + clientHalfSize
          }
        ]
      }

      return Object.assign({}, item, {
        pointers: item.pointers + 1,
        solutions: [
          ...item.solutions.map(solution => Object.assign({}, solution, {
            _selected: false
          })),
          {
            score: 1,
            feedback: '',
            _selected: true,
            area
          }
        ],
        _mode: MODE_SELECT
      })
    }
    case SELECT_AREA:
      return Object.assign({}, item, {
        solutions: item.solutions.map(solution => Object.assign({}, solution, {
          _selected: solution.area.id === action.id
        })),
        _mode: MODE_SELECT
      })
    case MOVE_AREA:
      return Object.assign({}, item, {
        solutions: item.solutions.map(solution => {
          if (solution.area.id === action.id) {
            // action coordinates are the center of the object being moved
            if (solution.area.shape === SHAPE_CIRCLE) {
              return Object.assign({}, solution, {
                area: Object.assign({}, solution.area, {
                  center: {
                    x: toAbs(action.x, item.image),
                    y: toAbs(action.y, item.image),
                    _clientX: action.x,
                    _clientY: action.y
                  }
                })
              })
            } else {
              const coords = solution.area.coords
              const width = coords[1].x - coords[0].x
              const height = coords[1].y- coords[0].y
              const clientWidth = coords[1]._clientX - coords[0]._clientX
              const clientHeight = coords[1]._clientY - coords[0]._clientY
              const offsetX = Math.round(width / 2)
              const offsetY = Math.round(height / 2)
              const clientOffsetX = Math.round(clientWidth / 2)
              const clientOffsetY = Math.round(clientHeight / 2)
              const absX = toAbs(action.x, item.image)
              const absY = toAbs(action.y, item.image)

              return Object.assign({}, solution, {
                area: Object.assign({}, solution.area, {
                  coords: [
                    Object.assign({}, coords[0], {
                      x: absX - offsetX,
                      y: absY - offsetY,
                      _clientX: action.x - clientOffsetX,
                      _clientY: action.y - clientOffsetY
                    }),
                    Object.assign({}, coords[1], {
                      x: absX - offsetX + width,
                      y: absY - offsetY + height,
                      _clientX: action.x - clientOffsetX + clientWidth,
                      _clientY: action.y - clientOffsetY + clientHeight
                    })
                  ]
                })
              })
            }
          }
          return solution
        })
      })
  }
  return item
}

function toAbs(length, imgProps) {
  const sizeRatio = imgProps.width / imgProps._clientWidth
  return Math.round(length * sizeRatio)
}

function blankImage() {
  return {
    id: makeId(),
    type: '',
    data: '',
    width: 0,
    height: 0
  }
}

function decorate(item) {
  return Object.assign({}, item, {
    image: Object.assign({}, item.image, {
      _clientWidth: 0,
      _clientHeight: 0,
    }),
    solutions: item.solutions.map(solution => {
      if (solution.area.shape === SHAPE_RECT) {
        return Object.assign({}, solution, {
          area: Object.assign({}, solution.area, {
            coords: solution.area.coords.map(coords => Object.assign({}, coords, {
              // we don't know the real values until image has been loaded into the dom
              _clientX: 0,
              _clientY: 0
            }))
          }),
          _selected: false
        })
      } else {
        return Object.assign({}, solution, {
          area: Object.assign({}, solution.area, {
            center: Object.assign({}, solution.area.center, {
              _clientX: 0,
              _clientY: 0
            }),
            _clientRadius: 0
          }),
          _selected: false
        })
      }
    }),
    _mode: MODE_RECT
  })
}

function validate(item) {
  if (item.image.type && item.image.type.indexOf('image') !== 0) {
    return {image: tex('graphic_error_not_an_image')}
  }

  if (item.image._size && item.image._size > MAX_IMG_SIZE) {
    return {image: tex('graphic_error_image_too_large')}
  }

  if (!item.image.data && !item.image.url) {
    return {image: tex('graphic_error_no_image', {count: MAX_IMG_SIZE})}
  }

  if (item.solutions.length === 0) {
    return {image: tex('graphic_error_no_solution')}
  }

  return {}
}

export default {
  component,
  reduce,
  decorate,
  validate
}
