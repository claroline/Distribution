import {tex} from './../../../utils/translate'
import $ from 'jquery'
import cloneDeep from 'lodash/cloneDeep'
import React, {Component, PropTypes as T} from 'react'
import {tcex} from '../../../utils/translate'

export class Highlight extends Component {
  constructor(props) {
    super(props)

    if (props.displayTrueAnswer) {
      this.checkedElements = cloneDeep(this.props.item.selections)
      this.checkedElements.sort((a, b) => {return a.begin - b.begin})
    } else {
      switch (props.item.mode) {
        case 'select': {
          this.checkedElements = this.props.item.selections
            .filter(selection => this.props.answer.indexOf(selection.id) > -1)
            .sort((a, b) => {return a.begin - b.begin})
        }
      }
    }
  }

  render() {
    return (<div dangerouslySetInnerHTML={{__html: this.getHtml()}}/>)
  }

  isSolutionValid(selection) {
    const solution = this.getSolutionForAnswer(selection)

    return solution.score > 0
  }

  getSolutionForAnswer(selection) {
    return this.props.item.solutions.find(solution => solution.selectionId === selection.id)
  }

  //copied from the clozes
  getWarningIcon(selection) {
    const solution = this.getSolutionForAnswer(selection)

    return solution && solution.score > 0 ?
       '<span class="fa fa-check answer-warning-span" aria-hidden="true"></span>' :
       '<span class="fa fa-times answer-warning-span" aria-hidden="true"></span>'
  }

  getSolutionScore(solution) {
    solution = this.getSolutionForAnswer(solution)
    const scoreTranslation = tcex('solution_score', solution.score, {'score': solution.score})

    return `<span class="item-score"> ${scoreTranslation} </span>`
  }

  getFeedback(solution) {
    solution = this.getSolutionForAnswer(solution)
    let feedback = solution.feedback
    if (!feedback) return ''

    return `<i role="button" class="feedback-btn fa fa-comments-o" data-content="${feedback}" data-toggle="popover" data-trigger="click" data-html="true"></i>`
  }

  getSpanClasses(displayTrueAnswer, isSolutionValid) {
    if (isSolutionValid && !displayTrueAnswer) return 'selection-success'
    if (!isSolutionValid && !displayTrueAnswer) return 'selection-error'
    if (displayTrueAnswer) return 'selection-info'
  }

  getFirstSpan(selection, displayTrueAnswer, isSolutionValid) {
    return `<span data-id=${selection.id} class="${this.getSpanClasses(displayTrueAnswer, isSolutionValid)}">`
  }

  getHtmlLength(solution, displayTrueAnswer, isSolutionValid) {
    let text = this.getFirstSpan(solution, displayTrueAnswer, isSolutionValid)
      + '</span>'
      + this.getWarningIcon(solution)

    if (this.props.showScore) {
      text += this.getFeedback(solution) +  this.getSolutionScore(solution)
    }

    return text.length
  }

  getHtml() {
    let isSolutionValid
    let idx = 0
    let text = this.props.item.text

    this.checkedElements.forEach(solution => {
      let isSolutionValid = this.props.displayTrueAnswer ? true: this.isSolutionValid(solution)
       let end = text.slice(solution.end + idx)
       text = text.slice(0, solution.begin + idx)
       + this.getFirstSpan(solution, this.props.displayTrueAnswer, isSolutionValid)
       + text.slice(solution.begin + idx, solution.end + idx)
       + this.getWarningIcon(solution)

       if (this.props.showScore) {
         text += this.getSolutionScore(solution) + this.getFeedback(solution)
       }

       text += '</span>'
       + end

       idx += this.getHtmlLength(solution, this.props.displayTrueAnswer, isSolutionValid) //+ 1 //+1 is wtf, maybe an error is lurking somewhere but the positions seems to be good
     })

    return text
  }

  componentDidMount() {
    $('[data-toggle="popover"]').popover()
  }
}
