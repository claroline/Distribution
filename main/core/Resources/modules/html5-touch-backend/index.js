import {NativeTypes, getEmptyImage} from 'react-dnd-html5-backend'
import HTML5TouchBackend from './HTML5TouchBackend'
import createHTML5Backend from 'react-dnd-html5-backend'

export {NativeTypes, getEmptyImage}

export default function createHTML5TouchBackend(manager) {
  HTML5TouchBackend.prototype = createHTML5Backend(manager)

  return new HTML5TouchBackend(manager)
}
