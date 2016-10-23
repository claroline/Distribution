import {Graphic as component} from './graphic.jsx'

function reduce(graphic = {}) {
  return graphic
}

export default {
  type: 'application/x.graphic+json',
  name: 'graphic',
  component,
  reduce
}
