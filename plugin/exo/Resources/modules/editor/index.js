import angular from 'angular/index'

import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {createStore} from './store'
import {Editor} from './components/editor.jsx'

import './style.css'

const rawQuiz = JSON.parse(document.querySelector('exercise').dataset.exercise)
const store = createStore(rawQuiz)
const dndEditor = DragDropContext(HTML5Backend)(Editor)

angular.module('editor', [])
  .component('editor', {
    controller: ['$element', el => {
      ReactDOM.render(
        React.createElement(
          Provider,
          {store},
          React.createElement(dndEditor)
        ),
        el[0]
      )
    }],
    template: '<div></div>'
  })
