import {ITEM_CREATE} from './../../quiz/editor/actions'
import {makeId, makeActionCreator} from './../../utils/utils'
import {tex} from './../../utils/translate'
import {
  MODE_RECT,
  MAX_IMG_SIZE,
  SHAPE_RECT,
  SHAPE_CIRCLE,
  AREA_DEFAULT_SIZE
} from './enums'
import {
  SELECT_MODE,
  SELECT_IMAGE,
  RESIZE_IMAGE,
  CREATE_AREA
} from './actions'
import {Graphic as component} from './editor.jsx'

function reduce(item = {}, action = {}) {
  switch (action.type) {
    case ITEM_CREATE:
      return decorate(Object.assign({}, item, {
        image: blankImage()
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
        solutions: item.solutions.map(solution => Object.assign({}, solution, {
          area: Object.assign({}, solution.area, {
            coords: solution.area.coords.map(coords => Object.assign({}, coords, {
              _clientX: toClient(coords.x),
              _clientY: toClient(coords.y)
            })),
            _clientRadius: solution.area.shape === SHAPE_CIRCLE ?
              toClient(solution.area.radius) :
              solution.area._clientRadius
          })
        }))
      })
    }
    case CREATE_AREA: {
      const clientX = action.x
      const clientY = action.y
      const clientHalfSize = AREA_DEFAULT_SIZE / 2
      const sizeRatio = item.image.width / item.image._clientWidth
      const toAbs = length => Math.floor(length * sizeRatio)
      const absX = toAbs(clientX)
      const absY = toAbs(clientY)
      const absHalfSize = toAbs(clientHalfSize)
      const area = {
        id: makeId(),
        shape: item._mode === MODE_RECT ? SHAPE_RECT : SHAPE_CIRCLE,
        color: 'blue',
        score: 1,
        feedback: ''
      }

      if (area.shape === SHAPE_CIRCLE) {
        area.coords = [{
          x: absX,
          y: absY,
          _clientX: clientX,
          _clientY: clientY
        }]
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
        solutions: [...item.solutions, {area}]
      })
    }
  }
  return item
}

function blankImage() {
  return {
    id: makeId(),
    type: '',
    url: '',
    width: 0,
    height: 0,
    _clientWidth: 0,
    _clientHeight: 0,
    _type: '',
    _size: ''
  }
}

function decorate(item) {
  return Object.assign({}, item, {
    pointers: 0,
    solutions: [],
    _mode: MODE_RECT
  })
}

function validate(item) {
  if (item.image._type && item.image._type.indexOf('image') !== 0) {
    return {image: tex('graphic_error_not_an_image')}
  }

  if (item.image._size && item.image._size > MAX_IMG_SIZE) {
    return {image: tex('graphic_error_image_too_large')}
  }

  if (!item.image.url) {
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
