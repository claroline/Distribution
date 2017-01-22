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
import {SELECT_MODE, SELECT_IMAGE, CREATE_AREA} from './actions'
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
    case CREATE_AREA: {
      const halfSize = AREA_DEFAULT_SIZE / 2
      const area = {
        id: makeId(),
        shape: item._mode === MODE_RECT ? SHAPE_RECT : SHAPE_CIRCLE,
        color: 'blue',
        score: 1,
        feedback: ''
      }

      if (area.shape === SHAPE_CIRCLE) {
        area.coords = [{x: action.x, y: action.y}]
        area.radius = halfSize
      } else {
        area.coords = [
          {
            x: action.x - halfSize,
            y: action.y - halfSize
          },
          {
            x: action.x + halfSize,
            y: action.y + halfSize
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
    height: 0
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
