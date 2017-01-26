import React, {Component, PropTypes as T} from 'react'
import {utils} from './utils'
import {Feedback} from '../../components/feedback-btn.jsx'
import {SolutionScore} from '../../components/score.jsx'
import classes from 'classnames'
import {WarningIcon} from './warning-icon.jsx'

class SelectAnswer extends Component
{
  constructor(props) {
    super(props)
    this.diffUserAnswer = null

    if (this.props.displayTrueAnswer) {
      //expected answer
      this.state = {
        selectedAnswer: this.props.solution.answers[0]
      }
    } else {
      const selectedAnswer = this.props.solution.answers.find(answer => answer.text === this.props.answer.answerText)

      if (!selectedAnswer) {
        this.diffUserAnswer = {
          text: this.props.answer.answerText,
          feedback: '',
          score: 0
        }
      }

      this.state = {
        selectedAnswer: {
          text: this.props.answer.answerText,
          score: selectedAnswer ? selectedAnswer.score: 0
        },
        includedAnswer: selectedAnswer ? true: false
      }
    }
  }

  change(event) {
    this.setState({selectedAnswer: this.props.solution.answers.find(answer => answer.text === event.target.value)})
  }

  isSolutionValid() {
    return utils.getSolutionForAnswer(this.props.solution, this.state.selectedAnswer) ? true: false
  }

  render() {
    return(
      <span>
        <select className={
            classes({
              'select-info': this.props.displayTrueAnswer,
              'select-success': this.isSolutionValid() && !this.props.displayTrueAnswer,
              'select-error': !this.isSolutionValid() && !this.props.displayTrueAnswer,
              'form-control': true,
              'inline-select': true
            })
          }
           disabled={!this.props.displayTrueAnswer}
           onChange={this.change.bind(this)}
          >
          {this.diffUserAnswer &&
            <option> {this.diffUserAnswer.text} </option>
          }
          {!this.diffUserAnswer && !this.props.showScore &&
            <option> {this.state.selectedAnswer.text} </option>
          }

          {this.props.showScore &&
            this.props.solution.answers.map((answer, key) => {
              return (<option key={key}> {answer.text} </option>)
            })
          }
        </select>
        <span className={classes({
          'score-success': this.isSolutionValid() && !this.props.displayTrueAnswer,
          'score-error': !this.isSolutionValid() && !this.props.displayTrueAnswer,
          'score-info': this.props.displayTrueAnswer
        })}>
          <WarningIcon solution={this.props.solution} answer={this.state.selectedAnswer}/>{'\u00a0'}
          {(this.props.showScore || this.isSolutionValid()) && this.state.selectedAnswer && this.state.selectedAnswer.feedback &&
            <Feedback feedback={this.state.selectedAnswer.feedback} id={this.props.solution.holeId}/>
          }
          {this.props.showScore &&
            <SolutionScore score={this.state.selectedAnswer && this.state.selectedAnswer.score ? this.state.selectedAnswer.score: 0}/>
          }
        </span>
      </span>
    )
  }
}

SelectAnswer.propTypes = {
  answer: T.object.isRequired,
  showScore: T.bool.isRequired,
  displayTrueAnswer: T.bool.isRequired,
  solution: T.object.isRequired
}

SelectAnswer.defaultProps = {
  answer: {
    answerText: ''
  }
}

class TextAnswer extends Component
{
  constructor(props) {
    super(props)
    this.isSolutionValid = utils.getSolutionForAnswer(this.props.solution, this.props.answer) ? true: false
  }

  render() {
    return(
      <span>
        <input
          className={
              classes({
                'select-info': this.props.displayTrueAnswer,
                'select-success': this.isSolutionValid && !this.props.displayTrueAnswer,
                'select-error': !this.isSolutionValid && !this.props.displayTrueAnswer,
                'form-control': true,
                'inline-select': true
              })
            }
          type='text'
          disabled
          value={this.props.displayTrueAnswer ? this.props.solution.answers[0].text: this.props.answer.answerText}
        />
        <span className={classes({
          'score-success': this.isSolutionValid && !this.props.displayTrueAnswer,
          'score-error': !this.isSolutionValid && !this.props.displayTrueAnswer,
          'score-info': this.props.displayTrueAnswer
        })}>
          <WarningIcon solution={this.props.solution} answer={this.props.displayTrueAnswer ? this.props.solution.answers[0].text: this.props.answer.answerText}/>{'\u00a0'}
          {(this.props.showScore || this.isSolutionValid) && this.props.solution.feedback &&
            <Feedback feedback={this.props.solution.feedback} id={this.props.solution.holeId}/>
          }
          {this.props.showScore &&
            <SolutionScore score={this.isSolutionValid || this.props.displayTrueAnswer ? this.props.solution.answers[0].score: 0}/>
          }
        </span>
      </span>
    )
  }
}

TextAnswer.propTypes = {
  answer: T.object.isRequired,
  showScore: T.bool.isRequired,
  displayTrueAnswer: T.bool.isRequired,
  solution: T.object.isRequired
}

TextAnswer.defaultProps = {
  answer: {
    answerText: ''
  }
}

export const Highlight = props => {
  const elements = utils.split(props.item.text, props.item.holes, props.item.solutions)
  return (
    <div>
      {elements.map((el, key) => {
        const solution = props.item.solutions.find(solution => solution.holeId === el.holeId)
        if (!solution) {
          return (<span key={key}></span>)
        }
        return (
          <span key={key}>
            {(solution.answers.length > 1) ?
              <span>
                {el.text}
                <SelectAnswer
                  answer={props.answer.find(ans => ans.holeId === el.holeId)}
                  showScore={props.showScore}
                  showFeedback={props.showFeedback}
                  displayTrueAnswer={props.displayTrueAnswer}
                  solution={solution}
                />
              </span> :
              (el.holeId) ?
                <span>
                  {el.text}
                  <TextAnswer
                    answer={props.answer.find(ans => ans.holeId === el.holeId)}
                    showScore={props.showScore}
                    displayTrueAnswer={props.displayTrueAnswer}
                    solution={solution}
                  />
                </span> :
                <span>{el.text}</span>
            }
          </span>
        )
      })}
    </div>
  )
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
