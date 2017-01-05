import React, {Component, PropTypes as T} from 'react'
import classes from 'classnames'
import {tex} from '../../utils/translate'
import {tcex} from '../../utils/translate'
import Tab from 'react-bootstrap/lib/Tab'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
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

const ChoiceMetadata = props => {
  return(
    <div className="panel panel-body">
      <h4>{props.title}</h4>
      <i>{props.description}</i>
    </div>
  )
}

ChoiceMetadata.propTypes = {
  title: T.string,
  description: T.string
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
      <i className="feedback-btn fa fa-comments-o"></i>
    </OverlayTrigger>
  )
}

Feedback.propTypes = {
  id: T.string.isRequired,
  feedback: T.string
}

const WarningIcon = props => {
  if (props.answers.indexOf(props.solution.id) > -1) {
    return props.solution.score > 0 ?
       <span className="fa fa-check answer-warning-span" aria-hidden="true"></span> :
       <span className="fa fa-times answer-warning-span" aria-hidden="true"></span>
  }

  return <span className="answer-warning-span"></span>
}

WarningIcon.propTypes = {
  answers: T.array,
  solution: T.shape({
    score: T.number,
    id: T.string
  })
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

  getAnswerClassForSolution(solution, answers) {
    return this.isSolutionChecked(solution, answers) ?
      solution.score > 0 ? 'bg-success text-success' : 'bg-danger text-danger' : ''
  }

  render() {
    return(
      <Tab.Container id={`${this.props.item.id}-paper`} defaultActiveKey="first">
        <Row className="clearfix">
          <Col sm={12}>
            <Nav bsStyle="tabs">
              <NavItem eventKey="first">
                  <span className="fa fa-user"></span> {tex('your_answer')}
              </NavItem>
              <NavItem eventKey="second">
                <span className="fa fa-check"></span> {tex('expected_answer')}
              </NavItem>
            </Nav>
          </Col>
          <Col sm={12}>
            <Tab.Content animation>
              <Tab.Pane eventKey="first">
                <ChoiceMetadata title={this.props.item.title} description={this.props.item.description}/>
                <div className="container choice-paper">
                  {this.props.item.solutions.map(solution =>
                    <div
                      key={this.answerId(solution.id)}
                      className={classes(
                        'item',
                        this.props.item.multiple ? 'checkbox': 'radio',
                        this.getAnswerClassForSolution(solution, this.props.answer.data)
                      )}>
                      <WarningIcon solution={solution} answers={this.props.answer.data}/>
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
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <ChoiceMetadata title={this.props.item.title} description={this.props.item.description}/>
                <div className="container choice-paper">
                  {this.props.item.solutions.map(solution =>
                    <div
                      key={this.expectedId(solution.id)}
                      className={classes(
                        'item',
                        this.props.item.multiple ? 'checkbox': 'radio'
                      )}
                    >
                      <span className="answer-warning-span"></span>
                      <input
                        className={this.props.item.multiple ? 'checkbox': 'radio'}
                        checked={solution.score > 0}
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
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
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
