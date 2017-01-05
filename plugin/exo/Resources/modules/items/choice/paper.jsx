import React, {Component, PropTypes as T} from 'react'
import classes from 'classnames'
import {tex} from '../../utils/translate'
import {tcex} from '../../utils/translate'
import Tab from 'react-bootstrap/lib/Tab'
import Tabs from 'react-bootstrap/lib/Tabs'
import Popover from 'react-bootstrap/lib/Popover'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'

const SolutionScore = props =>
  <span className="item-score">
    {tcex('solution_score', props.solution.score, {'score': props.solution.score})}
  </span>

SolutionScore.propTypes = {
  solution: T.shape({
    score: T.number
  })
}

const Feedback = props => {
  if (!props.feedback) return <span className="item-feedback"/>

  const popoverClick = (
    <Popover id={props.id} className="item-feedback">
      {props.feedback}
    </Popover>
  )

  return(
    <OverlayTrigger trigger="click" placement="top" overlay={popoverClick}>
      <i className="fa fa-comments-o"></i>
    </OverlayTrigger>
  )
}

Feedback.propTypes = {
  id: T.string.isRequired,
  feedback: T.string
}

export class ChoicePaper extends Component
{
  constructor(props) {
    super(props)
    this.state = {key: 1}
    this.handleSelect = this.handleSelect.bind(this)
  }

  getChoiceById(choiceId) {
    return this.props.item.choices.find(choice => choice.id === choiceId)
  }

  isSolutionChecked(solution, answers) {
    return answers ? answers.indexOf(solution.id) > -1 : false
  }

  handleSelect(key) {
    this.setState({key})
  }

  answerId(id) {
    return `${id}-your-answer`
  }

  expectedId(id) {
    return `${id}-expected-answer`
  }

  render() {
    return(
      <Tabs
        id={`${this.props.item.id}-paper`}
        activeKey={this.state.key}
        onSelect={this.handleSelect}
      >
        <Tab eventKey={1} title={tex('your_answer')}>
          <div className="container choice-paper">
            <h4>{this.props.item.title}</h4>
            <div><i>{this.props.item.description}</i></div>
            {this.props.item.solutions.map(solution =>
              <div
                key={this.answerId(solution.id)}
                className={classes(
                  'item',
                  this.props.item.multiple ? 'checkbox': 'radio'
                )}>
                <input
                  className={this.props.item.multiple ? 'checkbox': 'radio'}
                  checked={this.isSolutionChecked(solution, this.props.answer.data)}
                  id={this.answerId(solution.id)}
                  name={this.answerId(this.props.item.id)}
                  type={this.props.item.multiple ? 'checkbox': 'radio'}
                  disabled
                />
                <label
                  className="control-label"
                  htmlFor={this.answerId(solution.id)}
                  dangerouslySetInnerHTML={{__html: this.getChoiceById(solution.id).data}}
                />
              <Feedback
                id={`${solution.id}-feedback`}
                feedback={solution.feedback}
              />
                <SolutionScore solution={solution}/>
              </div>
            )}
          </div>
        </Tab>
        <Tab eventKey={2} title={tex('expected_answer')}>
          <div className="container choice-paper">
            {this.props.item.solutions.map(solution =>
              <div
                key={this.expectedId(solution.id)}
                className={classes(
                  'item',
                  this.props.item.multiple ? 'checkbox': 'radio'
                )}
              >
                <input
                  className={this.props.item.multiple ? 'checkbox': 'radio'}
                  checked={solution.score !== 0}
                  id={this.expectedId(solution.id)}
                  name={this.expectedId(this.props.item.id)}
                  type={this.props.item.multiple ? 'checkbox': 'radio'}
                  disabled
                />
                <label
                  className="control-label"
                  htmlFor={this.expectedId(solution.id)}
                  dangerouslySetInnerHTML={{__html: this.getChoiceById(solution.id).data}}
                />
                <Feedback
                  id={`${solution.id}-feedback-expected`}
                  feedback={solution.feedback}
                />
                <SolutionScore solution={solution}/>
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
    )
  }
}

ChoicePaper.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    choices: T.arrayOf(T.shape({
      id: T.string.isRequired,
      data: T.string.isRequired
    })).isRequired,
    multiple: T.bool.isRequired,
    solutions: T.arrayOf(T.object),
    title: T.string,
    description: T.string
  }).isRequired,
  answer: T.shape({
    data: T.array
  })
}
