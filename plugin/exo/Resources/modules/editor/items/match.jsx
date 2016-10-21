import React, {Component} from 'react'
import {tex} from './../lib/translate'
import Popover from 'react-bootstrap/lib/Popover'
import Button from 'react-bootstrap/lib/Button'


/* global jsPlumb */


export function initJsPlumb() {

  jsPlumb.setSuspendDrawing(false)

  // defaults parameters for all connections
  jsPlumb.importDefaults({
    Anchors: ['RightMiddle', 'LeftMiddle'],
    ConnectionsDetachable: true,
    Connector: 'Straight',
    DropOptions: {tolerance: 'touch'},
    HoverPaintStyle: {strokeStyle: '#FC0000'},
    LogEnabled: true,
    PaintStyle: {strokeStyle: '#777', lineWidth: 4}
  })

  jsPlumb.registerConnectionTypes({
    right: {
      paintStyle     : { strokeStyle: '#5CB85C', lineWidth: 5 },
      hoverPaintStyle: { strokeStyle: 'green',   lineWidth: 6 }
    },
    wrong: {
      paintStyle:      { strokeStyle: '#D9534F', lineWidth: 5 },
      hoverPaintStyle: { strokeStyle: 'red',     lineWidth: 6 }
    },
    default: {
      paintStyle     : { strokeStyle: 'grey',    lineWidth: 5 },
      hoverPaintStyle: { strokeStyle: '#FC0000', lineWidth: 6 }
    }
  })

  jsPlumb.setContainer(document.getElementById('match-question-container-id'))

  jsPlumb.addEndpoint(jsPlumb.getSelector('.source'), {
    anchor: 'RightMiddle',
    cssClass: 'endPoints',
    isSource: true,
    maxConnections: -1
  })

  jsPlumb.addEndpoint(jsPlumb.getSelector('.target'), {
    anchor: 'LeftMiddle',
    cssClass: 'endPoints',
    isTarget: true,
    maxConnections: -1
  })
}

function addConnections(data){


  for (let item of data) {
    jsPlumb.connect({
      source: 'draggable_' + item.left,
      target: 'droppable_' + item.right
    })
  }
}

class MatchLinkPopover extends Component {
  constructor(props){
    super(props)
    // here we should retrieve MatchLink
    // - title (composed with source.text + ' - ' + target.text)
    // - sourceId
    // - targetId
    // - score
    // - feedback

    this.state = {
      feedback:'',
      score:1
    }
  }

  handleScoreChange(event){
    this.setState({score: event.target.value})
  }

  handleFeedbackChange(event){
    this.setState({feedback: event.target.value})
  }

  render() {
    return (
      <Popover
        positionLeft={this.props.data.popover.left}
        positionTop={this.props.data.popover.top}
        placement="top"
        id={this.props.data.popover.id}
        title={this.props.data.popover.title}>
          <div className="form-group">
            <label>Score</label>
            <input className="form-control"  onChange={this.handleScoreChange.bind(this)} type="number" value={this.state.score}></input>
          </div>
          <div className="form-group">
            <label>Feedback</label>
            <textarea className="form-control" onChange={this.handleFeedbackChange.bind(this)} value={this.state.feedback}></textarea>
          </div>
          <hr/>
          <div className="row">
            <div className="col-xs-12 text-center">
              <div className="btn-group">
                <Button onClick={() => this.props.handlePopoverClose()} title={'close'}>
                  <i className="fa fa-close"></i>
                </Button>
                <Button onClick={() => this.props.handleConnectionDelete(this.props.data.popover.jsPlumbConnection)} title={'delete'}>
                  <i className="fa fa-trash"></i>
                </Button>
              </div>
            </div>
          </div>
      </Popover>
    )
  }
}
MatchLinkPopover.propTypes = {
  data: React.PropTypes.object.isRequired,
  handlePopoverClose: React.PropTypes.func.isRequired,
  handleConnectionDelete: React.PropTypes.func.isRequired
}


class Match extends Component {

  constructor(props) {
    super(props)
    this.state = {
      popover:{
        id:0,
        visible:false,
        top:0,
        left:0,
        title:'popover'
      },
      penalty:props.penalty,
      random: props.random
    }
  }

  componentDidMount() {
    initJsPlumb()
    addConnections(this.props.solutions)

    // new connection created event
    jsPlumb.bind('connection', function(connection, event) {
      let rootNode = document.getElementById('popover-place-holder')
      const rect = rootNode.getBoundingClientRect()
      this.setState({
        popover: {
          visible: true,
          id:connection.sourceId + '-' + connection.targetId,
          left: 0, // layerX ? screenX ? any other one ? this position calculation is wrong !! event.clientX - rect.right
          top: event.layerY - rect.top, // layerY ? screenY ? pageY ? any other one ? this position calculation is wrong !! event.clientY - rect.top
          title:connection.sourceId + '-' + connection.targetId,
          jsPlumbConnection: connection
        }
      })
    }.bind(this))

    jsPlumb.bind('beforeDrop', function () {
      return true
    })

    // configure connection
    jsPlumb.bind('click', function (connection, event) {
      let rootNode = document.getElementById('popover-place-holder')
      const rect = rootNode.getBoundingClientRect()
      this.setState({
        popover: {
          visible: true,
          id:connection.sourceId + '-' + connection.targetId,
          left: 0, // layerX ? screenX ? any other one ? this position calculation is wrong !!
          top: event.layerY - rect.top, // layerY ? screenY ? pageY ? any other one ? this position calculation is wrong !!
          title:connection.sourceId + '-' + connection.targetId,
          jsPlumbConnection: connection
        }
      })
    }.bind(this))
  }

  removeConnection(connection){
    jsPlumb.detach(connection)
    this.setState({
      popover: {
        visible: false
      },
      penalty:0,
      random: false
    })
  }

  closePopover(){
    this.setState({popover: {visible: !this.state.popover.visible}})
  }

  render() {
    return (
      <div id="match-question-container-id" className="match-question-container">
        <div className="form-group">
          <label htmlFor="set-penalty">{tex('set_question_penalty_label')}</label>
          <input
            id="set-penalty"
            value={this.props.penalty}
            title={tex('score')}
            type="number"
            className="form-control member-score"
          />
        </div>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={this.props.random}
               />
            {tex('Ordre des propositions et des labels aléatoire.')}
          </label>
        </div>
        <hr/>
        <div className="row">
          <div className="col-md-5 text-center">
            <div className="items-container">
              <div className="item-flex-row text-center source" id="draggable_1">
                <div className="left-controls">
                  <a role="button" className="fa fa-trash-o"/>
                </div>
                <div className="text-fields">
                  <textarea className="form-control" value="Oh" />
                </div>
              </div>
            </div>
            <hr/>
            <Button>
              <i className="fa fa-plus"></i> &nbsp;Ajouter un item
            </Button>
          </div>
          <div id="popover-place-holder" className="col-md-2">
            { this.state.popover.visible &&
              <MatchLinkPopover
                handleConnectionDelete={this.removeConnection.bind(this)}
                handlePopoverClose={this.closePopover.bind(this)}
                data={this.state}/>
            }
          </div>
          <div className="col-md-5 text-center">
            <div className="items-container">
              <div className="item-flex-row text-center target" id="droppable_1">
                <div className="text-fields">
                  <textarea className="form-control" value="My" />
                </div>
                <div className="right-controls">
                  <a role="button" className="fa fa-trash-o"/>
                </div>
              </div>
              <div className="item-flex-row target" id="droppable_2">
                <div className="text-fields">
                  <textarea className="form-control" value="God" />
                </div>
                <div className="right-controls">
                  <a role="button" className="fa fa-trash-o"/>
                </div>
              </div>
            </div>
            <hr/>
            <Button>
              <i className="fa fa-plus"></i> &nbsp;Ajouter un item
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

Match.propTypes = {
  random: React.PropTypes.bool.isRequired,
  penalty: React.PropTypes.number.isRequired,
  firstSet: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  secondSet: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  solutions: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
}

export {Match}
