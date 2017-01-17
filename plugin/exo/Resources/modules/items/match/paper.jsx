import React, {Component, PropTypes as T} from 'react'
import classes from 'classnames'
import {tex} from '../../utils/translate'
import Tab from 'react-bootstrap/lib/Tab'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Nav from 'react-bootstrap/lib/Nav'
import Popover from 'react-bootstrap/lib/Popover'
import NavItem from 'react-bootstrap/lib/NavItem'
import {Feedback} from '../components/feedback-btn.jsx'
import {SolutionScore} from '../components/score.jsx'
import {WarningIcon} from './utils/warning-icon.jsx'
import {utils} from './utils/utils'
import {Metadata} from '../components/metadata.jsx'

/* global jsPlumb */

function getPopoverPosition(connectionClass, id){
  const containerRect =  document.getElementById('popover-place-holder-' + id).getBoundingClientRect()
  const connectionRect =  document.querySelectorAll('.' + connectionClass)[0].getBoundingClientRect()
  // only compute top position
  return {
    top:  connectionRect.top + connectionRect.height / 2 - containerRect.top
  }
}

function initJsPlumb(jsPlumbInstance) {
  // defaults parameters for all connections
  jsPlumbInstance.importDefaults({
    Anchors: ['RightMiddle', 'LeftMiddle'],
    ConnectionsDetachable: false,
    Connector: 'Straight',
    DropOptions: {tolerance: 'touch'},
    HoverPaintStyle: {strokeStyle: '#FC0000'},
    LogEnabled: true,
    PaintStyle: {strokeStyle: '#777', lineWidth: 4}
  })

  jsPlumbInstance.registerConnectionTypes({
    'blue': {
      paintStyle     : { strokeStyle: '#31B0D5', lineWidth: 5 },
      hoverPaintStyle: { strokeStyle: '#31B0D5',   lineWidth: 6 }
    },
    'green': {
      paintStyle     : { strokeStyle: '#5CB85C', lineWidth: 5 },
      hoverPaintStyle: { strokeStyle: '#5CB85C',   lineWidth: 6 }
    },
    'red': {
      paintStyle     : { strokeStyle: '#D9534F', lineWidth: 5 },
      hoverPaintStyle: { strokeStyle: '#D9534F',   lineWidth: 6 }
    },
    'default': {
      paintStyle     : { strokeStyle: 'grey',    lineWidth: 5 },
      hoverPaintStyle: { strokeStyle: 'grey', lineWidth: 6 }
    }
  })
}

/* draw student answer draw them */
/*function drawAnswers(answers, solutions, jsPlumbInstance, tabSelected){

  // draw all student answers
  if (tabSelected === 'first') {
    //const type = solutions.findIndex(solution => answer.firstId === solution.firstId && answer.secondId === solution.secondId) > -1 ? 'green' : 'red'
    for (const solution of solutions) {
      const type = answers.findIndex(answer => answer.firstId === solution.firstId && answer.secondId === solution.secondId) > -1 ? 'green' : 'red'
      const connection = jsPlumbInstance.connect({
        source: 'source_' + solution.firstId,
        target: 'target_' + solution.secondId,
        type: type
      })

      const connectionClass = 'connection-' + solution.firstId + '-' + solution.secondId
      connection.addClass(connectionClass)

      connection.bind('mouseover', (conn) => {
        console.log('you hoverd on ', conn)
      })
    }
  } else {
    for (const answer of answers) {
      const type = solutions.findIndex(solution => answer.firstId === solution.firstId && answer.secondId === solution.secondId) > -1 ? 'blue' : 'default'
      jsPlumbInstance.connect({
        source: 'source_' + answer.firstId,
        target: 'target_' + answer.secondId,
        type: type
      })
    }
  }
}*/

export const MatchLinkPopover = props =>
      <Popover
        id={`popover-${props.solution.firstId}-${props.solution.secondId}`}
        positionTop={props.top}
        placement="top">
          connection popover
      </Popover>


MatchLinkPopover.propTypes = {
  top: T.number.isRequired,
  solution: T.object.isRequired,
  handlePopoverClose: T.func.isRequired
}

class MatchItem extends Component{
  constructor(props) {
    super(props)
  }

  componentDidMount(){
    this.props.onMount(this.props.type, this.props.type + '_' + this.props.item.id)
  }

  render() {
    return (
      <div className={classes('item', this.props.type)} id={this.props.type + '_' + this.props.item.id}>
        <div className="item-content" dangerouslySetInnerHTML={{__html: this.props.item.data}} />
      </div>
    )
  }
}

MatchItem.propTypes = {
  type: T.string.isRequired,
  item: T.object.isRequired,
  onMount: T.func.isRequired
}

export class MatchPaper extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      key: 'first',
      showPopover: false
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.jsPlumbInstance = jsPlumb.getInstance()
    initJsPlumb(this.jsPlumbInstance)

    this.firstContainer = null
    this.secondContainer = null
    this.handleWindowResize = this.handleWindowResize.bind(this)
    this.handleConnectionHover = this.handleConnectionHover.bind(this)
  }

  drawAnswers(){
    // draw all student answers
    if (this.state.key === 'first') {
      for (const solution of this.props.item.solutions) {
        const type = this.props.answer.findIndex(answer => answer.firstId === solution.firstId && answer.secondId === solution.secondId) > -1 ? 'green' : 'red'
        const connection = this.jsPlumbInstance.connect({
          source: 'source_' + solution.firstId,
          target: 'target_' + solution.secondId,
          type: type
        })

        const connectionClass = 'connection-' + solution.firstId + '-' + solution.secondId
        connection.addClass(connectionClass)

        connection.bind('mouseover', (conn) => {
          this.handleConnectionHover(conn)
        })
      }
    } else {
      for (const answer of this.props.answer) {
        const type = this.props.item.solutions.findIndex(solution => answer.firstId === solution.firstId && answer.secondId === solution.secondId) > -1 ? 'blue' : 'default'
        this.jsPlumbInstance.connect({
          source: 'source_' + answer.firstId,
          target: 'target_' + answer.secondId,
          type: type
        })
      }
    }
  }

  closePopover() {
    console.log('connection out')
    //console.log(connection)
  }

  handleConnectionHover(connection) {
    console.log('connection hover')
    console.log(connection)

    const firstId = connection.sourceId.replace('source_', '')
    const secondId = connection.targetId.replace('target_', '')
    const connectionClass = 'connection-' + firstId + '-' + secondId
    const positions = getPopoverPosition(connectionClass, this.props.item.id)

    const solutionIndex = this.props.item.solutions.findIndex(solution => solution.firstId === firstId && solution.secondId === secondId)

    this.setState({
      popover: {
        visible: true,
        top: positions.top
      },
      current: solutionIndex
    })
  }

  handleWindowResize() {
    this.jsPlumbInstance.repaintEverything()
  }

  // switch tab handler
  handleSelect(key) {
    this.setState({key})
    this.jsPlumbInstance.detachEveryConnection()
    const container = key === 'first' ? this.firstContainer : this.secondContainer
    this.jsPlumbInstance.setContainer(container)
    window.setTimeout(() => {
      //this.drawAnswers(this.props.answer, this.props.item.solutions, this.jsPlumbInstance, key)
      this.drawAnswers()
    }, 200)
  }

  componentDidMount() {
    this.jsPlumbInstance.setContainer(this.firstContainer)
    window.addEventListener('resize', this.handleWindowResize)

    // we have to wait for elements to be at there right place before drawing... so... timeout
    window.setTimeout(() => {
      //this.drawAnswers(this.props.answer, this.props.item.solutions, this.jsPlumbInstance, 'first')
      this.drawAnswers()
    }, 200)
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.handleWindowResize)
    jsPlumb.detachEveryConnection()
    // use reset instead of deleteEveryEndpoint because reset also remove event listeners
    jsPlumb.reset()
    this.jsPlumbInstance = null
    delete this.jsPlumbInstance
  }

  /**
   * When adding a firstSet or secondSet item we need to add an jsPlumb endpoint to it
   * In order to achieve that we need to wait for the new item to be mounted
  */
  itemDidMount(type, id){
    const isLeftItem = type === 'source'
    const selector = '#' +  id
    const anchor = isLeftItem ? 'RightMiddle' : 'LeftMiddle'

    window.setTimeout(() => {
      if (isLeftItem) {
        this.jsPlumbInstance.addEndpoint(this.jsPlumbInstance.getSelector(selector), {
          anchor: anchor,
          cssClass: 'endPoints',
          isSource: true,
          maxConnections: -1
        })
      } else {
        this.jsPlumbInstance.addEndpoint(this.jsPlumbInstance.getSelector(selector), {
          anchor: anchor,
          cssClass: 'endPoints',
          isTarget: true,
          maxConnections: -1
        })
      }
    }, 100)
  }

  render() {
    return (
      <Tab.Container id={`match-${this.props.item.id}-paper`} defaultActiveKey="first">
        <Row className="clearfix">
          <Col sm={12}>
            <Nav bsStyle="tabs">
              <NavItem eventKey="first" onSelect={() => this.handleSelect('first')}>
                  <span className="fa fa-user"></span> {tex('your_answer')}
              </NavItem>
              <NavItem eventKey="second" onSelect={() => this.handleSelect('second')}>
                <span className="fa fa-check"></span> {tex('expected_answer')}
              </NavItem>
            </Nav>
          </Col>
          <Col sm={12}>
            <Tab.Content animation>
              <Tab.Pane eventKey="first">
                <Metadata title={this.props.item.title} description={this.props.item.description}/>
                <div id={`match-question-paper-${this.props.item.id}-first`} className="match-question-paper" ref={(el) => { this.firstContainer = el }}>
                  <div className="jsplumb-row">
                    <div className="item-col">
                      <ul>
                      {this.props.item.firstSet.map((item) =>
                        <li key={'source_' + item.id}>
                          <MatchItem
                            onMount={(type, id) => this.itemDidMount(type, id)}
                            item={item}
                            type="source"
                          />
                        </li>
                      )}
                      </ul>
                    </div>
                    <div className="divide-col" id={`popover-container-${this.props.item.id}`}>
                      { this.state.showPopover &&
                          <MatchLinkPopover
                            handlePopoverClose={() => this.closePopover()}
                            top={this.state.top}
                            solution={this.props.item.solutions[this.state.current]}
                          />
                        }
                    </div>
                    <div className="item-col">
                      <ul>
                      {this.props.item.secondSet.map((item) =>
                        <li key={'target_' + item.id}>
                          <MatchItem
                            onMount={(type, id) => this.itemDidMount(type, id)}
                            item={item}
                            type="target"
                          />
                        </li>
                      )}
                      </ul>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <Metadata title={this.props.item.title} description={this.props.item.description}/>
                <div id={`match-question-paper-${this.props.item.id}-second`} className="match-question-paper" ref={(el) => { this.secondContainer = el }}>
                  <div className="jsplumb-row">
                    <div className="item-col">
                      <ul>
                      {this.props.item.firstSet.map((item) =>
                        <li key={'source_' + item.id}>
                          <MatchItem
                            onMount={(type, id) => this.itemDidMount(type, id)}
                            item={item}
                            type="source"
                          />
                        </li>
                      )}
                      </ul>
                    </div>
                    <div className="divide-col" />
                    <div className="item-col">
                      <ul>
                      {this.props.item.secondSet.map((item) =>
                        <li key={'target_' + item.id}>
                          <MatchItem
                            onMount={(type, id) => this.itemDidMount(type, id)}
                            item={item}
                            type="target"
                          />
                        </li>
                      )}
                      </ul>
                    </div>
                  </div>
                  <div className="solution-row">
                    {this.props.item.solutions.map((solution) =>
                      <div
                        key={`solution-${solution.firstId}-${solution.secondId}`}
                        className={classes(
                          'item',
                          {'bg-info text-info' : solution.score > 0},
                          {'bg-danger text-danger' :solution.score <= 0 }
                        )}
                      >
                        <div className="item-content" dangerouslySetInnerHTML={{__html: utils.getSolutionData(solution.firstId, this.props.item.firstSet)}} />
                        <div className="item-content" dangerouslySetInnerHTML={{__html: utils.getSolutionData(solution.secondId, this.props.item.secondSet)}} />
                        <Feedback
                          id={`answer-${solution.firstId}-${solution.secondId}-feedback`}
                          feedback={solution.feedback}
                        />
                        <SolutionScore score={solution.score}/>
                      </div>
                    )}
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
