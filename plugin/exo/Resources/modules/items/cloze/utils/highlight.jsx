import React, {Component, PropTypes as T} from 'react'
import {utils} from './utils'
import {tcex} from '../../../utils/translate'
//import 'bootstrap'

function getWarningIcon(solution, answer) {
  solution = utils.getSolutionForAnswer(solution, answer)

  return solution && solution.score > 0 ?
     '<span class="fa fa-check answer-warning-span" aria-hidden="true"></span>' :
     '<span class="fa fa-times answer-warning-span" aria-hidden="true"></span>'
}

function getSolutionScore(score) {
  const scoreTranslation = tcex('solution_score', score, {'score': score})

  return `<span class="item-score"> ${scoreTranslation} </span>`
}

function getFeedback(feedback) {
  return `<i
    role="button"
    class="feedback-btn fa fa-comments-o"
    data-content="${feedback}"
    data-toggle="popover"
    title="feedback">
  </i>`
}

function getSelectClasses(displayTrueAnswer, isSolutionValid) {
  const inputClasses = ['form-control', 'inline-select']
  if (displayTrueAnswer) inputClasses.push('select-info')
  if (isSolutionValid && !displayTrueAnswer) inputClasses.push('select-success')
  if (!isSolutionValid && !displayTrueAnswer) inputClasses.push('select-error')

  return inputClasses.reduce((a, b) => a += ' ' + b)
}

function getSpanClasses(displayTrueAnswer, isSolutionValid) {
  const classes = []
  if (isSolutionValid && !displayTrueAnswer) classes.push('score-success')
  if (!isSolutionValid && !displayTrueAnswer) classes.push('score-error')
  if (displayTrueAnswer) classes.push('score-info')

  return classes.reduce((a, b) => a += ' ' + b)
}

export class Highlight extends Component {
  constructor(props) {
    super(props)
    this.updateHoleInfo = this.updateHoleInfo.bind(this)
    this.elements = utils.split(props.item.text, props.item.holes, props.item.solutions)
  }

  render() {
    return (<div dangerouslySetInnerHTML={{__html: this.getHtml()}}/>)
  }

  getTextInput(answer, showScore, displayTrueAnswer, solution) {
    if (!answer) return ''
    if (!answer.answerText) answer.answerText = ''
    const isSolutionValid = utils.getSolutionForAnswer(solution, answer) ? true: false
    const classes = getSelectClasses(displayTrueAnswer, isSolutionValid)

    const html = `<input
      class="${classes}"
      type='text'
      disabled
      value=${displayTrueAnswer ? solution.answers[0].text: answer.answerText}
    />
    <span class="${getSpanClasses(displayTrueAnswer, isSolutionValid)}">
      ${getWarningIcon(solution, displayTrueAnswer ? solution.answers[0].text: answer.answerText)}
      ${(showScore || isSolutionValid) && solution.feedback &&
        `${getFeedback(solution.feedback)}`
      }

      ${showScore &&
        `${getSolutionScore(isSolutionValid || displayTrueAnswer ? solution.answers[0].score: 0)}`
      }
    </span>
    `

    return html
  }

  getSelectInput(answer, showScore, displayTrueAnswer, solution, holeId) {
    if (!answer) return ''
    if (!answer.answerText) answer.answerText = ''
    let selectedAnswer = utils.getSolutionForAnswer(solution, answer)
    let diffUserAnswer = false

    if (!selectedAnswer) {
      selectedAnswer = {
        text: answer.answerText,
        feedback: '',
        score: 0
      }
      diffUserAnswer = true
    }

    const tmp = utils.getSolutionForAnswer(solution, selectedAnswer)
    const isSolutionValid = tmp && tmp.score > 0
    const classes = getSelectClasses(displayTrueAnswer, isSolutionValid)

    return `
      <select
        id='select-${holeId}'
        class='${classes}'
        ${!displayTrueAnswer &&
          'disabled'
        }
      >

      ${diffUserAnswer && !displayTrueAnswer &&
        `<option> ${selectedAnswer.text} </option>`
      }

      ${!diffUserAnswer && !showScore &&
        '<option> display selected </option>'
      }

      ${showScore &&
        solution.answers.map(answer => `<option> ${answer.text} </option>`)
      }

    </select>
    <span id="span-answer-${holeId}" class="${getSpanClasses(displayTrueAnswer, isSolutionValid)}">
      ${getWarningIcon(solution, selectedAnswer.text)}

      ${(showScore || isSolutionValid) && selectedAnswer.feedback &&
        getFeedback(solution.feedback)
      }

      ${showScore &&
        getSolutionScore(selectedAnswer.score)
      }
    </span>
    `
  }

  componentDidMount() {
    this.elements.forEach(el => {
      let htmlElement = document.getElementById('select-' + el.holeId)
      if (htmlElement) {
        htmlElement.addEventListener(
          'change',
          e => this.updateHoleInfo(el.holeId, e.target.value)
        )
      }
    })
  }

  updateHoleInfo(holeId, answer) {
    alert(holeId + answer)
  }

  getHtml() {
    return this.elements.map(el => {
      const solution = this.props.item.solutions.find(solution => solution.holeId === el.holeId)
      if (!solution) return ''

      return solution.answers.length > 1 ?
        `
        ${el.text}
        ${this.getSelectInput(
          this.props.answer.find(ans => ans.holeId === el.holeId),
          this.props.showScore,
          this.props.displayTrueAnswer,
          solution,
          el.holeId
        )}
      `:
      el.holeId ?
       `
         ${el.text}
         ${this.getTextInput(
           this.props.answer.find(ans => ans.holeId === el.holeId),
           this.props.showScore,
           this.props.displayTrueAnswer,
           solution
         )}
     `:
      el.text
    }).reduce((a, b) => a += b)
  }
}

Highlight.propTypes = {
  item: T.shape({
    text: T.string.isRequired,
    holes: T.array.isRequired,
    solutions: T.array.isRequired
  }).isRequired,
  showScore: T.bool.isRequired,
  displayTrueAnswer: T.bool.isRequired,
  answer: T.array.isRequired
}

Highlight.defaultProps = {
  answer: [{
    answerText: ''
  }]
}
