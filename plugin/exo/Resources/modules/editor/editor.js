import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {Editor as EditorComponent} from './components/editor.jsx'
import {registerItemType, getDecorators} from './item-types'
import {normalize} from './normalizer'
import {decorate} from './decorators'
import {createStore} from './store'
import './style.css'

import choice from './items/choice'
import match from './items/match'
import cloze from './items/cloze'
import graphic from './items/graphic'
import open from './items/open'

export class Editor {
  constructor(rawQuizData) {
    [choice, match, cloze, graphic, open].forEach(registerItemType)
    this.store = createStore(decorate(normalize(rawQuizData), getDecorators()))
    this.dndEditor = DragDropContext(HTML5Backend)(EditorComponent)
  }

  render(element) {
    ReactDOM.render(
      React.createElement(
        Provider,
        {store: this.store},
        React.createElement(this.dndEditor)
      ),
      element
    )
  }
}
