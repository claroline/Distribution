import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {Quiz as QuizComponent} from './components/quiz.jsx'
import {normalize} from './normalizer'
import {decorate} from './decorators'
import {createStore} from './store'

import './editor/style.css'

import {registerItemType, getDecorators} from './../items/item-types'

import choice from './../items/choice/choice'
import match from './../items/match/match'
import cloze from './../items/cloze/cloze'
import graphic from './../items/graphic/graphic'
import open from './../items/open/open'

export class Quiz {
  constructor(rawQuizData) {
    [choice, match, cloze, graphic, open].forEach(registerItemType)
    this.store = createStore(decorate(normalize(rawQuizData), getDecorators()))
    this.dndQuiz = DragDropContext(HTML5Backend)(QuizComponent)
  }

  render(element) {
    ReactDOM.render(
      React.createElement(
        Provider,
        {store: this.store},
        React.createElement(this.dndQuiz)
      ),
      element
    )
  }
}
