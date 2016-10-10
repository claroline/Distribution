import {Graphic as component} from './graphic.jsx'

function reducer(graphic = {}) {
  return graphic
}

export default {
  type: 'application/x.graphic+json',
  name: 'graphic',
  question: true,
  component,
  reducer
}
