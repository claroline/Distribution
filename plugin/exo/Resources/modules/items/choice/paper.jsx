import React, {Component, PropTypes as T} from 'react'
import {tex} from '../../utils/translate'
import {tcex} from '../../utils/translate'
import Tab from 'react-bootstrap/lib/Tab'
import Tabs from 'react-bootstrap/lib/Tabs'
import Popover from 'react-bootstrap/lib/Popover'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'

const SolutionScore = props => <span> {tcex('solution_score', props.solution.score, {'score': props.solution.score})} </span>

SolutionScore.propTypes = {
  solution: T.shape({
    score: T.number
  })
}

const Feedback = (props) => {
  if (!props.feedback) return <span/>

  const popoverClick = (
    <Popover id="popover-trigger-click">
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
  feedback: T.string
}

export class ChoicePaper extends Component
{
  constructor() {
    super()
    this.state = {key: 1}
    this.handleSelect = this.handleSelect.bind(this)
  }

  render() {
    return(
      <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">
        <Tab eventKey={1} title={tex('your_answer')}>
          <div className="container">
            {this.props.item.solutions.map(solution =>
              <div key={solution.id} className={this.props.item.multiple ? 'checkbox': 'radio'}>
                <input
                  className={this.props.item.multiple ? 'checkbox': 'optradio'}
                  checked={this.isSolutionChecked(solution, this.props.answer.data)}
                  id={solution.id}
                  name={`${this.props.item.id}-your-answer`}
                  type={this.props.item.multiple ? 'checkbox': 'radio'}
                  disabled
                />
                <label
                  htmlFor={solution.id}> {this.getChoiceById(solution.id).data}
                </label>
                <Feedback feedback={solution.feedback}/>
                <SolutionScore solution={solution}/>
              </div>
            )}
          </div>
        </Tab>
        <Tab eventKey={2} title={tex('expected_answer')}>
          <div className="container">
            {this.props.item.solutions.map(solution =>
              <div key={solution.id} className={this.props.item.multiple ? 'checkbox': 'radio'}>
                <input
                  className={this.props.item.multiple ? 'checkbox': 'optradio'}
                  checked={solution.score !== 0}
                  id={solution.id}
                  name={`${this.props.item.id}-expected-answer`}
                  type={this.props.item.multiple ? 'checkbox': 'radio'}
                  disabled
                />
                <label
                  className="control-label"
                  htmlFor={solution.id}> {this.getChoiceById(solution.id).data}
                </label>
                <Feedback feedback={solution.feedback}/>
                <SolutionScore solution={solution}/>
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
    )
  }

  getChoiceById(choiceId) {
    return this.props.item.choices.find(choice => choice.id === choiceId)
  }

  isSolutionChecked(solution, answers) {
    return answers.indexOf(solution.id) > -1
  }

  handleSelect(key) {
    this.setState({key})
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
    solutions: T.arrayOf(T.object)
  }).isRequired,
  answer: T.shape({
    data: T.array
  })
}
