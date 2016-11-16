import React from 'react'
import ReactDOM from 'react-dom'


//import {Editor} from './editor/editor'

//import {QuizBar} from './components/quiz-bar.jsx'

import {QuizOverview} from './components/quiz-overview.jsx'

const container = document.querySelector('.quiz-container')

const rawQuiz = JSON.parse(container.dataset.quiz)
const editable = !!container.dataset.editable
const empty = !rawQuiz.steps.length

// const editor = new Editor(rawQuiz)

// editor.render(container)
//
// React.render()

// ReactDOM.render(
//   <QuizBar
//     title={rawQuiz.title}
//     editable={editable}
//     empty={empty}
//     published={false}
//   />,
//   container
// )

ReactDOM.render(
  <QuizOverview
    editable={editable}
    empty={empty}
    created={rawQuiz.meta.created}
    parameters={rawQuiz.parameters}
  />,
  container
)
