import React, {Component, PropTypes as T} from 'react'
import {tex, t} from './../lib/translate'
import Popover from 'react-bootstrap/lib/Popover'
import classes from 'classnames'
import {Textarea} from './../components/form/textarea.jsx'
import {actions} from './match.js'
import get from 'lodash/get'

/* global jsPlumb */

function getPopoverPosition(connectionClass){
  const containerRect =  document.getElementById('popover-place-holder').getBoundingClientRect()
  const connectionRect =  document.querySelectorAll('.' + connectionClass)[0].getBoundingClientRect()
  return {
    left: 0 - connectionRect.width / 2 + 20, // 20 is the endPoint width
    top:  connectionRect.top + connectionRect.height / 2 - containerRect.top
  }
}

function initJsPlumb(id, instance) {
  instance.setSuspendDrawing(false)

  // defaults parameters for all connections
  instance.importDefaults({
    Anchors: ['RightMiddle', 'LeftMiddle'],
    ConnectionsDetachable: true,
    Connector: 'Straight',
    DropOptions: {tolerance: 'touch'},
    HoverPaintStyle: {strokeStyle: '#FC0000'},
    LogEnabled: true,
    PaintStyle: {strokeStyle: '#777', lineWidth: 4}
  })

  instance.registerConnectionTypes({
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

  instance.setContainer(document.getElementById('match-question-container-id-' + id))
}

function drawSolutions(solutions, instance){
  for (const solution of solutions) {
    instance.connect({
      source: 'source_' + solution.firstId,
      target: 'target_' + solution.secondId,
      type: solution.score > 0 ? 'valid':'invalid'
    })
  }
}

class MatchLinkPopover extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <Popover
        id={`popover-${this.props.solution.firstSetId}-${this.props.solution.secondSetId}`}
        positionLeft={this.props.popover.left}
        positionTop={this.props.popover.top}
        placement="bottom"
        title={
          <div>
            {tex('match_edit_connection')}
            <div className="pull-right">
              <a
                role="button"
                title={'delete'}
                className={classes('btn', 'btn-sm', 'btn-link-danger', 'fa fa-trash', {disabled: !this.props.solution._deletable})}
                onClick={() => this.props.solution._deletable &&
                  this.props.handleConnectionDelete(this.props.solution.firstSetId, this.props.solution.secondSetId)
                }
              />
              &nbsp;
              <a role="button" className="btn btn-sm btn-link fa fa-close" onClick={() => this.props.handlePopoverClose()} title={'close'}></a>
            </div>
          </div>
        }>
          <div className="form-group">
            <label>{tex('score')}</label>
            <input
              className="form-control"
              onChange={
                e => this.props.onChange(
                  actions.updateSolution(this.props.solution.firstSetId, this.props.solution.secondSetId, 'score', e.target.value)
                )
              }
              type="number"
              value={this.props.solution.score}
             />
          </div>
          <div className="form-group">
            <label>{tex('feedback')}</label>
            <Textarea
              id={`solution-${this.props.solution.firstSetId}-${this.props.solution.secondSetId}-feedback`}
              content={this.props.solution.feedback}
              onChange={feedback => this.props.onChange(
                actions.updateSolution(this.props.solution.firstSetId, this.props.solution.secondSetId, 'feedback', feedback)
              )}
            />
          </div>
      </Popover>
    )
  }
}

MatchLinkPopover.propTypes = {
  popover: T.object.isRequired,
  solution: T.object.isRequired,
  handlePopoverClose: T.func.isRequired,
  handleConnectionDelete: T.func.isRequired,
  onChange: T.func.isRequired
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
        { this.props.type === 'source' &&
          <div className="left-controls">
            <a  role="button"
                title={t('delete')}
                className={classes('btn', 'btn-sm', 'btn-link', 'fa', 'fa-trash-o', {disabled: !this.props.item._deletable})}
                onClick={() => this.props.item._deletable && this.props.onUnmount(
                  true, this.props.item.id, this.props.type + '_' + this.props.item.id
                )}
            />
          </div>
        }
        <div className="text-fields">
            <Textarea
              onChange={data => this.props.onChange(
                actions.updateSet(this.props.type === 'source', this.props.item.id, data)
              )}
              id={`${this.props.type}-${this.props.item.id}-data`}
              content={this.props.item.data} />
        </div>
        { this.props.type === 'target' &&
          <div className="right-controls">
            <a  role="button"
                title={t('delete')}
                className={classes('btn', 'btn-sm', 'btn-link', 'fa', 'fa-trash-o', {disabled: !this.props.item._deletable})}
                onClick={() => this.props.item._deletable && this.props.onUnmount(
                  false, this.props.item.id, this.props.type + '_' + this.props.item.id
                )}
            />
          </div>
        }
      </div>
    )
  }
}

MatchItem.propTypes = {
  type: T.string.isRequired,
  item: T.object.isRequired,
  onMount: T.func.isRequired,
  onUnmount: T.func.isRequired,
  onChange: T.func.isRequired
}

class Match extends Component {

  constructor(props) {
    super(props)
    this.jsPlumb = jsPlumb.getInstance()
    this.state = {
      popover: {
        visible: false,
        left: 0,
        top: 0
      },
      jsPlumbConnection: null,
      current: null
    }
  }

  componentDidMount() {

    initJsPlumb(this.props.item.id, this.jsPlumb)
    drawSolutions(this.props.item.solutions, this.jsPlumb)

    // new connection created event
    this.jsPlumb.bind('connection', function (data) {
      data.connection.setType('selected')

      const firstSetId = data.sourceId.replace('source_', '')
      const secondSetId = data.targetId.replace('target_', '')
      const connectionClass = 'connection-' + firstSetId + '-' + secondSetId
      data.connection.addClass(connectionClass)
      const positions = getPopoverPosition(connectionClass)
      const solution = {
        firstSetId: firstSetId,
        secondSetId: secondSetId,
        feedback: '',
        score: 1
      }
      // add solution to store
      this.props.onChange(actions.addSolution(solution))
      const solutionIndex = this.props.item.solutions.findIndex(solution => solution.firstSetId === firstSetId && solution.secondSetId === secondSetId)

      this.setState({
        popover: {
          visible: true,
          left: positions.left,
          top: positions.top
        },
        jsPlumbConnection: data.connection,
        current: solutionIndex
      })
    }.bind(this))

    this.jsPlumb.bind('beforeDrop', function (connection) {
      // check that the connection is not already in jsPlumbConnections before creating it
      const list = jsPlumb.getConnections().filter(el => el.sourceId === connection.sourceId && el.targetId === connection.targetId )
      return list.length === 0
    })

    // configure connection
    this.jsPlumb.bind('click', function (connection) {
      connection.setType('selected')

      const firstSetId = connection.sourceId.replace('source_', '')
      const secondSetId = connection.targetId.replace('target_', '')
      const connectionClass = 'connection-' + firstSetId + '-' + secondSetId
      const positions = getPopoverPosition(connectionClass)
      const solutionIndex = this.props.item.solutions.findIndex(el => el.firstSetId === firstSetId && el.secondSetId === secondSetId)

      this.setState({
        popover: {
          visible: true,
          left: positions.left,
          top: positions.top
        },
        jsPlumbConnection: connection,
        current: solutionIndex
      })
    }.bind(this))
  }

  itemWillUnmount(isLeftSet, id, elemId){
    // remove item endpoint
    // https://jsplumbtoolkit.com/community/doc/miscellaneous-examples.html
    // Remove all Endpoints for the element, deleting their Connections.
    // not sure about this one especially concerning events
    this.jsPlumb.removeAllEndpoints(elemId)
    this.props.onChange(
      actions.removeSet(isLeftSet, id)
    )
  }

  /**
   * When adding a firstSet or secondSet item we need to add an jsPlumb endpoint to it
   * In order to achieve that we need to wait for the new item to be mounted
  */
  itemDidMount(type, id){
    const isLeftItem = type === 'source'
    const selector = '#' +  id
    const anchor = isLeftItem ? 'RightMiddle' : 'LeftMiddle'
    if (isLeftItem) {
      this.jsPlumb.addEndpoint(this.jsPlumb.getSelector(selector), {
        anchor: anchor,
        cssClass: 'endPoints',
        isSource: true,
        maxConnections: -1
      })
    } else {
      this.jsPlumb.addEndpoint(this.jsPlumb.getSelector(selector), {
        anchor: anchor,
        cssClass: 'endPoints',
        isTarget: true,
        maxConnections: -1
      })
    }
  }

  removeConnection(firstSetId, secondSetId){
    this.jsPlumb.detach(this.state.jsPlumbConnection)
    this.setState({
      popover: {
        visible: false
      },
      jsPlumbConnection: null,
      current: null
    })
    // also delete the corresponding solution in props
    this.props.onChange(
      actions.removeSolution(firstSetId, secondSetId)
    )
  }

  closePopover(){
    this.setState({popover: {visible: false}})
    const list = this.jsPlumb.getConnections()
    for(const conn of list){
      let type = 'valid'
      const firstSetId = conn.sourceId.replace('source_', '')
      const secondSetId = conn.targetId.replace('target_', '')
      const solution = this.props.item.solutions.find(solution => solution.firstSetId === firstSetId && solution.secondSetId === secondSetId)
      if(undefined !== solution && solution.score <= 0){
        type = 'invalid'
      }
      conn.setType(type)
    }
  }

  // click outside the popover but inside the question items row will close the popover
  handlePopoverFocusOut(event){
    const elem = event.target.closest('#popover-place-holder')
    if(null === elem){
      this.closePopover()
    }
  }

  /**
   * We need to tell jsPlumb to repaint each time something make the form changins it's size
   * For now this handle :
   * - Error message show / hide
   * - Item deletion -> if any other item is below the one that is currently deleted it's follower will go up but the endpoint stay at the previous place
   * - TODO handle RTE size change to repaint connections && endpoints
   */
  componentDidUpdate(prevProps){
    const repaint = (prevProps.item.firstSet.length > this.props.item.firstSet.length || prevProps.item.secondSet.length > this.props.item.secondSet.length) || get(this.props.item, '_touched')
    if(repaint) {
      this.jsPlumb.repaintEverything()
    }
  }

  componentWillUnmount(){
    this.jsPlumb.detachEveryConnection()
    // use reset instead of deleteEveryEndpoint because reset also remove event listeners
    this.jsPlumb.reset()
  }

  render() {
    return (
      <div id={`match-question-container-id-${this.props.item.id}`} className="match-question-container">
        { get(this.props.item, '_touched') &&
          get(this.props.item, '_errors.items') &&
          <div className="error-text">
            <span className="fa fa-warning"></span>
            {this.props.item._errors.items}
          </div>
        }
        { get(this.props.item, '_touched') &&
          get(this.props.item, '_errors.solutions') &&
          <div className="error-text">
            <span className="fa fa-warning"></span>
            {this.props.item._errors.solutions}
          </div>
        }
        { get(this.props.item, '_touched') &&
          get(this.props.item, '_errors.warning') &&
          <div className="error-text">
            <span className="fa fa-info"></span>
            {this.props.item._errors.warning}
          </div>
        }
        <div className="form-group">
          <label htmlFor="match-penalty">{tex('match_penalty_label')}</label>
          <input
            id="match-penalty"
            className="form-control"
            value={this.props.item.penalty}
            type="number"
            min="0"
            onChange={e => this.props.onChange(
               actions.updateProperty('penalty', e.target.value)
            )}
          />
        </div>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={this.props.item.random}
              onChange={e => this.props.onChange(
                actions.updateProperty('random', e.target.value)
              )}
            />
            {tex('match_shuffle_labels_and_proposals')}
          </label>
        </div>
        <hr/>
        <div className="match-items" onClick={this.handlePopoverFocusOut.bind(this)}>
          <div className="item-col">
            <ul>
            {this.props.item.firstSet.map((item) =>
              <li key={'source_' + item.id}>
                <MatchItem
                  onChange={this.props.onChange}
                  onMount={this.itemDidMount.bind(this)}
                  onUnmount={this.itemWillUnmount.bind(this)}
                  item={item}
                  type="source"
                />
              </li>
            )}
            </ul>
            <div className="footer text-center">
              <button
                type="button"
                className="btn btn-default"
                onClick={() => this.props.onChange(actions.addSet(true))}
              >
                <span className="fa fa-plus"/>
                {tex('match_add_item')}
              </button>
            </div>
          </div>
          <div id="popover-place-holder" ref="popoverContainer">
            { this.state.popover.visible &&
                <MatchLinkPopover
                  handleConnectionDelete={this.removeConnection.bind(this)}
                  handlePopoverClose={this.closePopover.bind(this)}
                  popover={this.state.popover}
                  solution={this.props.item.solutions[this.state.current]}
                  onChange={this.props.onChange}
                />
              }
          </div>
          <div className="item-col">
            <ul>
              {this.props.item.secondSet.map((item) =>
                <li key={'target_' + item.id}>
                  <MatchItem
                    onChange={this.props.onChange}
                    onMount={this.itemDidMount.bind(this)}
                    onUnmount={this.itemWillUnmount.bind(this)}
                    item={item}
                    type="target"
                  />
                </li>
              )}
            </ul>
            <div className="footer text-center">
              <button
                type="button"
                className="btn btn-default"
                onClick={() => this.props.onChange(actions.addSet(false))}
              >
                <span className="fa fa-plus"/>
                {tex('match_add_item')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Match.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    random: T.bool.isRequired,
    penalty: T.number.isRequired,
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
    solutions: T.arrayOf(T.shape({
      firstSetId: T.string.isRequired,
      secondSetId: T.string.isRequired,
      score: T.number.isRequired,
      feedback: T.string
    })).isRequired,
    _errors: T.object
  }).isRequired,
  onChange: T.func.isRequired
}

export {Match}
