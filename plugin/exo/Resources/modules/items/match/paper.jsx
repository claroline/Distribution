import React, {Component, PropTypes as T} from 'react'
import classes from 'classnames'
import {tex} from '../../utils/translate'
import Tab from 'react-bootstrap/lib/Tab'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import {Feedback} from '../components/feedback-btn.jsx'
import {SolutionScore} from '../components/score.jsx'
import {WarningIcon} from './utils/warning-icon.jsx'
import {utils} from './utils/utils'
import {Metadata} from '../components/metadata.jsx'

export class MatchPaper extends Component
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
    return (
      <Tab.Container id={`match-${this.props.item.id}-paper`} defaultActiveKey="first">
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
                <Metadata title={this.props.item.title} description={this.props.item.description}/>
                <div className="container match-paper">
                  {this.props.item.solutions.map(solution =>
                    <div
                      key={utils.answerId(solution.id)}
                      className={classes(
                        'item',
                        utils.getAnswerClassForSolution(solution, this.props.answer)
                      )}
                    >
                      <WarningIcon solution={solution} answers={this.props.answer}/>

                      <Feedback
                        id={`${solution.id}-feedback`}
                        feedback={solution.feedback}
                      />
                      <SolutionScore score={solution.score}/>
                    </div>
                  )}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <Metadata title={this.props.item.title} description={this.props.item.description}/>
                <div className="container choice-paper">
                  {this.props.item.solutions.map(solution =>
                    <div
                      key={`${this.props.item.id}-${utils.expectedId(solution.id)}`}
                      className="item"
                    >
                      <span className="answer-warning-span"></span>


                      <Feedback
                        id={`${solution.id}-feedback-expected`}
                        feedback={solution.feedback}
                      />
                      <SolutionScore score={solution.score}/>
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

MatchPaper.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    firstSet: T.arrayOf(T.shape({
      id: T.string.isRequired,
      type: T.string.isRequired,
      data: T.string.isRequired
    })).isRequired,
    secondSet: T.arrayOf(T.shape({
      id: T.string.isRequired,
      type: T.string.isRequired,
      data: T.string.isRequired
    })).isRequired,
    solutions: T.arrayOf(T.object),
    title: T.string,
    description: T.string
  }).isRequired,
  answer: T.array
}

MatchPaper.defaultProps = {
  answer: []
}
