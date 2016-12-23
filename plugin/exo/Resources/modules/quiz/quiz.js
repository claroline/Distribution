import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {Quiz as QuizComponent} from './components/quiz.jsx'
import {normalize} from './normalizer'
import {decorate} from './decorators'
import {createStore} from './store'
import {makeRouter} from './router'
import {registerDefaultItemTypes, getDecorators} from './../items/item-types'

import './editor/style.css'

export class Quiz {
  constructor(rawQuizData, noServer = false) {
    registerDefaultItemTypes()

    const quizData = decorate(normalize(rawQuizData), getDecorators())

    this.store = createStore(Object.assign({noServer: noServer}, quizData))
    this.dndQuiz = DragDropContext(HTML5Backend)(QuizComponent)
    makeRouter(this.store.dispatch.bind(this.store))
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
