import {Quiz} from './quiz'

const container = document.querySelector('.quiz-container')
const rawQuizData = JSON.parse(container.dataset.quiz)
const quiz = new Quiz(rawQuizData)

quiz.render(container)
