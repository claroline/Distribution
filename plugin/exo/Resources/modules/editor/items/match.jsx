import React, {Component} from 'react'
import {tex} from './../lib/translate'
import Popover from 'react-bootstrap/lib/Popover'
import Button from 'react-bootstrap/lib/Button'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'


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

function addConnections(){
  const data = [
    {
      left: '1',
      right: '2'
    },
    {
      left: '1',
      right: '1'
    }
  ]

  for (let item of data) {
    jsPlumb.connect({
      source: 'draggable_' + item.left,
      target: 'droppable_' + item.right
    })
  }
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
        title:'popover',
        feedback:'',
        score:0
      }
    }
  }

  componentDidMount() {
    initJsPlumb()
    addConnections()

    // new connection created event
    jsPlumb.bind('connection', function(connection, event) {
      // paint it red
      //connection._jsPlumb.hoverPaintStyle.strokeStyle = '#FC0000'
      let rootNode = document.getElementById('popover-place-holder')
      const rect = rootNode.getBoundingClientRect()
      this.setState({
        popover: {
          visible: true,
          id:connection.sourceId + '-' + connection.targetId,
          left: event.pageX - rect.right,
          top: event.layerY - rect.top,
          title:connection.sourceId + '-' + connection.targetId,
          score: 1,
          feedback: 'This is a feedback',
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
      // paint it red
      //connection._jsPlumb.hoverPaintStyle.strokeStyle = '#FC0000'
      const rect = rootNode.getBoundingClientRect()
      this.setState({
        popover: {
          visible: true,
          id:connection.sourceId + '-' + connection.targetId,
          left: event.pageX - rect.right,
          top: event.layerY - rect.top,
          title:connection.sourceId + '-' + connection.targetId,
          score: 1,
          feedback: 'This is a feedback',
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
      }
    })
  }

  onFocus(){
    console.log('focused')
  }

  onBlur(){
    console.log('blur')
  }

  render() {
    return (
      <div onFocus={this.onFocus.bind(this)} id="match-question-container-id" className="match-question-container">
        <div className="form-group">
          <label htmlFor="set-penalty">{tex('set_question_penalty_label')}</label>
          <input
            id="set-penalty"
            value={1}
            title={tex('score')}
            type="number"
            className="form-control member-score"
            onChange={() => {}}
          />
        </div>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              onChange={() => {}}
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
                  <span role="button" className="fa fa-trash-o"/>
                </div>
                <div className="text-fields">
                  <textarea className="form-control" value="Oh" />
                </div>
              </div>
            </div>
            <hr/>
            <button className="btn btn-default">
              <i className="fa fa-plus"></i> &nbsp;Ajouter un item
            </button>
          </div>
          <div id="popover-place-holder" className="col-md-2">
            { this.state.popover.visible &&
              <Popover
                  onBlur={this.onBlur.bind(this)}
                  positionLeft={this.state.popover.left}
                  positionTop={this.state.popover.top}
                  placement="top"
                  id={this.state.popover.id}
                  title={this.state.popover.title}>
                <div className="form-group">
                  <label>Score</label>
                  <input className="form-control" type="number" value={this.state.popover.score}></input>
                </div>
                <div className="form-group">
                  <label>Feedback</label>
                  <textarea className="form-control" value={this.state.popover.feedback}></textarea>
                </div>
                <hr/>
                <div className="row">
                  <div className="col-xs-12 text-center">
                    <div className="btn-group">
                      <Button onClick={() => this.setState({popover: {visible: !this.state.popover.visible}})} title={'close'}>
                        <i className="fa fa-close"></i>
                      </Button>
                      <Button onClick={() => this.removeConnection(this.state.popover.jsPlumbConnection)} title={'delete'}>
                        <i className="fa fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              </Popover>
            }
          </div>
          <div className="col-md-5 text-center">
            <div className="items-container">
              <div className="item-flex-row text-center target" id="droppable_1">
                <div className="text-fields">
                  <textarea className="form-control" value="My" />
                </div>
                <div className="right-controls">
                  <span role="button" className="fa fa-trash-o"/>
                </div>
              </div>
              <div className="item-flex-row target" id="droppable_2">
                <div className="text-fields">
                  <textarea className="form-control" value="God" />
                </div>
                <div className="right-controls">
                  <span role="button" className="fa fa-trash-o"/>
                </div>
              </div>
            </div>

            <hr/>
            <button className="btn btn-default">
              <i className="fa fa-plus"></i> &nbsp;Ajouter un item
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export {Match}
