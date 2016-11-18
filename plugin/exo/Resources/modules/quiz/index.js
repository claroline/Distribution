import {Quiz} from './quiz'

const container = document.querySelector('.quiz-container')
const rawQuizData = JSON.parse(container.dataset.quiz)
const quiz = new Quiz(rawQuizData)

quiz.render(container)

// import React from 'react'
// import ReactDOM from 'react-dom'
//
// import {Router, browserHistory} from 'react-router'
//

//import {Editor} from './editor/editor'

//import {QuizBar} from './components/quiz-bar.jsx'

// import {QuizOverview} from './overview/overview.jsx'
//
// import {Quiz} from './components/quiz.jsx'
//
// const container = document.querySelector('.quiz-container')
//
// const rawQuiz = JSON.parse(container.dataset.quiz)
// const editable = !!container.dataset.editable
// const empty = !rawQuiz.steps.length

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

// ReactDOM.render(
//   <QuizOverview
//     editable={editable}
//     empty={empty}
//     created={rawQuiz.meta.created}
//     parameters={rawQuiz.parameters}
//   />,
//   container
// )

// ReactDOM.render(
//   <Router history={browserHistory}>
//     <Route path="/" component={Overview}>
//       <Route path="/overivew">
//     </Route>
//
//     <Quiz
//       title={rawQuiz.title}
//       description={rawQuiz.description || ''}
//       editable={editable}
//       empty={empty}
//       created={rawQuiz.meta.created}
//       published={rawQuiz.meta.published}
//       parameters={rawQuiz.parameters}
//     />
//   </Router>
//   ,
//   container
// )
