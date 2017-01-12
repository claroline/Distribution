import React, {Component, PropTypes as T} from 'react'
import classes from 'classnames'
import {tex} from '../../utils/translate'
import {tcex} from '../../utils/translate'
import Tab from 'react-bootstrap/lib/Tab'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import {Feedback} from './utils/feedback-btn.jsx'
import {WarningIcon} from './utils/warning-icon.jsx'
import {utils} from './utils/utils'

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

export class ChoicePaper extends Component
{
  constructor(props) {
    super(props)
    this.state = {key: 1}
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect(key) {
    this.setState({key})
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
                      key={utils.answerId(solution.id)}
                      className={classes(
                        'item',
                        this.props.item.multiple ? 'checkbox': 'radio',
                        utils.getAnswerClassForSolution(solution, this.props.answer)
                      )}>
                      <WarningIcon solution={solution} answers={this.props.answer}/>
                      <input
                        className={this.props.item.multiple ? 'checkbox': 'radio'}
                        checked={utils.isSolutionChecked(solution, this.props.answer)}
                        id={utils.answerId(solution.id)}
                        name={utils.answerId(this.props.item.id)}
                        type={this.props.item.multiple ? 'checkbox': 'radio'}
                        disabled
                      />
                      <label
                        className="control-label"
                        htmlFor={utils.answerId(solution.id)}
                        dangerouslySetInnerHTML={{__html: utils.getChoiceById(this.props.item.choices, solution.id).data}}
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
                      key={utils.expectedId(solution.id)}
                      className={classes(
                        'item',
                        this.props.item.multiple ? 'checkbox': 'radio'
                      )}
                    >
                      <span className="answer-warning-span"></span>
                      <input
                        className={this.props.item.multiple ? 'checkbox': 'radio'}
                        checked={solution.score > 0}
                        id={utils.expectedId(solution.id)}
                        name={utils.expectedId(this.props.item.id)}
                        type={this.props.item.multiple ? 'checkbox': 'radio'}
                        disabled
                      />
                      <label
                        className="control-label"
                        htmlFor={utils.expectedId(solution.id)}
                        dangerouslySetInnerHTML={{__html: utils.getChoiceById(this.props.item.choices, solution.id).data}}
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
  answer: T.array
}

ChoicePaper.defaultProps = {
  answer: []
}
