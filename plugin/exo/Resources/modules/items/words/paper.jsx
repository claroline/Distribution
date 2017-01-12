import React, {Component, PropTypes as T} from 'react'
import {tex} from '../../utils/translate'
import Tab from 'react-bootstrap/lib/Tab'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import {Highlight} from './utils/highlight.jsx'
import {utils} from './utils/utils'
import {Metadata} from '../components/metadata.jsx'
import {Feedback} from '../components/feedback-btn.jsx'
import {SolutionScore} from '../components/score.jsx'
import classes from 'classnames'

const AnswerTable = (props) => {
  return(
    <div className="container word-paper">
      {props.answers.map(el =>
        <div
          key={el.word}
          className={classes(
            'item',
            {
              'bg-success text-success': el.found && el.score > 0,
              'bg-danger text-danger': el.found && el.score <= 0
            }
        )}>
          <span className="word-label">{el.word}</span>
          <Feedback
            id={`${el.word}-feedback`}
            feedback={el.feedback}
          />
          <SolutionScore score={el.score}/>
        </div>
      )}
    </div>
  )
}

AnswerTable.propTypes = {
  answers: T.arrayOf(T.shape({
    feedback: T.string,
    word: T.string.isRequired,
    score: T.number.isRequired
  }))
}

export class WordsPaper extends Component
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
    const textElements = utils.getTextElements(this.props.answer, this.props.item.solutions)
    var halfLength = Math.ceil(textElements.length / 2)
    var leftSide = textElements.splice(0, halfLength)
    var rightSide = textElements

    return (
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
                <Metadata title={this.props.item.title} description={this.props.item.description}/>
                <Highlight
                  text={this.props.answer}
                  solutions={this.props.item.solutions}
                  showScore={true}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <Metadata title={this.props.item.title} description={this.props.item.description}/>
                <div className="container">
                  <div className="row">
                    <div className="col-md-6">
                      <AnswerTable answers={leftSide}/>
                    </div>
                    <div className="col-md-6">
                      <AnswerTable answers={rightSide}/>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    )
  }
}

WordsPaper.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    solutions: T.arrayOf(T.object)
  }).isRequired,
  answer: T.string.isRequired
}
