import React, {Component} from 'react'
import {tex, t} from './../lib/translate'
import Popover from 'react-bootstrap/lib/Popover'
import Button from 'react-bootstrap/lib/Button'
import {
  makeNewItem
} from './match'

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
    'valid': {
      paintStyle     : { strokeStyle: '#5CB85C', lineWidth: 5 },
      hoverPaintStyle: { strokeStyle: 'green',   lineWidth: 6 }
    },
    'invalid': {
      paintStyle:      { strokeStyle: '#D9534F', lineWidth: 5 },
      hoverPaintStyle: { strokeStyle: 'red',     lineWidth: 6 }
    },
    'selected': {
      paintStyle:      { strokeStyle: '#006DCC', lineWidth: 6 },
      hoverPaintStyle: { strokeStyle: '#006DCC', lineWidth: 6 }
    },
    'default': {
      paintStyle     : { strokeStyle: 'grey',    lineWidth: 5 },
      hoverPaintStyle: { strokeStyle: 'orange', lineWidth: 6 }
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
      source: 'draggable_' + item.firstId,
      target: 'droppable_' + item.secondId
    })
  }
}

function getPopoverPosition(e) {
  const rect =  document.getElementById('popover-place-holder').getBoundingClientRect()
  return {
    left: 0 - rect.width / 2,
    top: e.clientY - rect.top
  }
}

class MatchLinkPopover extends Component {
  constructor(props){
    super(props)

    this.state = {
      feedback: null === this.props.solution || undefined === this.props.solution ? '' : this.props.solution.feedback,
      score: null === this.props.solution || undefined === this.props.solution ? 0 : this.props.solution.score
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
        positionLeft={this.props.popover.left}
        positionTop={this.props.popover.top}
        placement="bottom"
        id={this.props.popover.id}
        title={this.props.popover.title}>
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
                <Button bsClass={'btn btn-danger'} onClick={() => this.props.handleConnectionDelete()} title={'delete'}>
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
  popover: React.PropTypes.object.isRequired,
  solution: React.PropTypes.object,
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
        title:''
      },
      jsPlumbConnection: null,
      solution: null // current solution that is edited
    }
  }

  componentDidMount() {
    initJsPlumb()
    addConnections(this.props.solutions)

    // new connection created event
    jsPlumb.bind('connection', function(data, event) {
      data.connection.setType('selected')
      const positions = getPopoverPosition(event)
      const firstSetId = data.sourceId.replace('draggable_', '')
      const secondSetId = data.targetId.replace('droppable_', '')
      const title = this.props.firstSet.find(el => el.id === firstSetId).data + ' - ' + this.props.secondSet.find(el => el.id === secondSetId).data
      this.setState({
        popover: {
          visible: true,
          id:data.sourceId + '-' + data.targetId,
          left: positions.left,
          top: positions.top,
          title:title
        },
        jsPlumbConnection: data.connection,
        solution: null
      })
    }.bind(this))

    jsPlumb.bind('beforeDrop', function () {
      return true
    })

    // configure connection
    jsPlumb.bind('click', function (connection, event) {
      connection.setType('selected')
      const positions = getPopoverPosition(event)
      const firstSetId = connection.sourceId.replace('draggable_', '')
      const secondSetId = connection.targetId.replace('droppable_', '')
      const title = this.props.firstSet.find(el => el.id === firstSetId).data + ' - ' + this.props.secondSet.find(el => el.id === secondSetId).data
      const solution = this.props.solutions.find(el => el.firstId === firstSetId && el.secondId === secondSetId)
      this.setState({
        popover: {
          visible: true,
          id:firstSetId + '-' + secondSetId,
          left: positions.left,
          top: positions.top,
          title:title
        },
        jsPlumbConnection: connection,
        solution: solution
      })
    }.bind(this))
  }

  removeConnection(){
    jsPlumb.detach(this.state.jsPlumbConnection)
    const firstSetId = this.state.jsPlumbConnection.sourceId.replace('draggable_', '')
    const secondSetId = this.state.jsPlumbConnection.targetId.replace('droppable_', '')
    // should also delete the corresponding solution in props
    this.setState({
      popover: {
        visible: false
      },
      penalty:0,
      random: false
    })
  }

  closePopover(){
    const list = jsPlumb.getConnections()
    for(const conn of list){
      conn.setType('default')
    }
    this.setState({popover: {visible: false}})
  }
  // click outside the popover but inside the question items row will close the popover
  handlePopoverFocusOut(event){
    const elem = event.target.closest('#popover-place-holder')
    if(null === elem){
      this.closePopover()
    }
  }

  addFirstSetItem(){
    const item = makeNewItem()
  }

  addSecondSetItem(){
    const item = makeNewItem()
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
        <div className="row" onClick={this.handlePopoverFocusOut.bind(this)}>
          <div className="col-md-5 text-center">
            <div className="items-container">
            {this.props.firstSet.map((item, index) =>
              <div key={item.id} className="item-flex-row text-center source" id={'draggable_' + item.id}>
                <div className="left-controls">
                  <a role="button" title={t('delete')} className="fa fa-trash-o"/>
                </div>
                <div className="text-fields">
                  { item.type === 'text/html' &&
                    <textarea className="form-control" value={item.data} />
                  }
                  { item.type === 'text/plain' &&
                    <input className="form-control" value={item.data} />
                  }
                </div>
              </div>
            )}
            </div>
            <hr/>
            <Button onClick={this.addFirstSetItem.bind(this)}>
              <i className="fa fa-plus"></i> &nbsp;Ajouter un item
            </Button>
          </div>
          <div id="popover-place-holder" className="col-md-2">
            { this.state.popover.visible &&
              <MatchLinkPopover
                handleConnectionDelete={this.removeConnection.bind(this)}
                handlePopoverClose={this.closePopover.bind(this)}
                popover={this.state.popover}
                solution={this.state.solution}
                />
            }
          </div>
          <div className="col-md-5 text-center">
            <div className="items-container">
              {this.props.secondSet.map((item, index) =>
                <div key={item.id} className="item-flex-row text-center target" id={'droppable_' + item.id}>
                  <div className="text-fields">
                    { item.type === 'text/html' &&
                      <textarea className="form-control" value={item.data} />
                    }
                    { item.type === 'text/plain' &&
                      <input className="form-control" value={item.data} />
                    }
                  </div>
                  <div className="right-controls">
                    <a role="button" className="fa fa-trash-o"/>
                  </div>
                </div>
              )}
            </div>
            <hr/>
            <Button onClick={this.addSecondSetItem.bind(this)}>
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
