import React, {Component, PropTypes as T} from 'react'
import Popover from 'react-bootstrap/lib/Popover'
import classes from 'classnames'
import get from 'lodash/get'
import {tex, t} from './../../utils/translate'
import {Textarea} from './../../components/form/textarea.jsx'
import {actions} from './match.js'

/* global jsPlumb */

function getPopoverPosition(connectionClass, id){
  const containerRect =  document.getElementById('popover-place-holder-' + id).getBoundingClientRect()
  const connectionRect =  document.querySelectorAll('.' + connectionClass)[0].getBoundingClientRect()
  return {
    left: 0 - connectionRect.width / 2 + 20, // 20 is the endPoint width
    top:  connectionRect.top + connectionRect.height / 2 - containerRect.top
  }
}

function initJsPlumb(id, jsPlumbInstance) {
  jsPlumbInstance.setSuspendDrawing(false)

  // defaults parameters for all connections
  jsPlumbInstance.importDefaults({
    Anchors: ['RightMiddle', 'LeftMiddle'],
    ConnectionsDetachable: true,
    Connector: 'Straight',
    DropOptions: {tolerance: 'touch'},
    HoverPaintStyle: {strokeStyle: '#FC0000'},
    LogEnabled: true,
    PaintStyle: {strokeStyle: '#777', lineWidth: 4},
    Scope: id
  })

  jsPlumbInstance.registerConnectionTypes({
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

  jsPlumbInstance.setContainer(document.getElementById('match-question-container-id-' + id))
}

function drawSolutions(solutions, jsPlumbInstance){
  for (const solution of solutions) {
    jsPlumbInstance.connect({
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
        id={`popover-${this.props.solution.firstId}-${this.props.solution.secondId}`}
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
                  this.props.handleConnectionDelete(this.props.solution.firstId, this.props.solution.secondId)
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
                  actions.updateSolution(this.props.solution.firstId, this.props.solution.secondId, 'score', e.target.value)
                )
              }
              type="number"
              value={this.props.solution.score}
             />
          </div>
          <div className="form-group">
            <label>{tex('feedback')}</label>
            <Textarea
              id={`solution-${this.props.solution.firstId}-${this.props.solution.secondId}-feedback`}
              content={this.props.solution.feedback}
              onChange={feedback => this.props.onChange(
                actions.updateSolution(this.props.solution.firstId, this.props.solution.secondId, 'feedback', feedback)
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
                actions.updateItem(this.props.type === 'source', this.props.item.id, data)
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
    this.jsPlumbInstance = jsPlumb.getInstance()
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

    initJsPlumb(this.props.item.id, this.jsPlumbInstance)
    window.setTimeout(function () {
      drawSolutions(this.props.item.solutions, this.jsPlumbInstance)
    }.bind(this), 500)


    // new connection created event
    this.jsPlumbInstance.bind('connection', function (data) {
      data.connection.setType('selected')

      const firstId = data.sourceId.replace('source_', '')
      const secondId = data.targetId.replace('target_', '')
      const connectionClass = 'connection-' + firstId + '-' + secondId
      data.connection.addClass(connectionClass)
      const positions = getPopoverPosition(connectionClass, this.props.item.id)
      const solution = {
        firstId: firstId,
        secondId: secondId,
        feedback: '',
        score: 1
      }
      // add solution to store
      this.props.onChange(actions.addSolution(solution))
      const solutionIndex = this.props.item.solutions.findIndex(solution => solution.firstId === firstId && solution.secondId === secondId)

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

    this.jsPlumbInstance.bind('beforeDrop', function (connection) {
      // check that the connection is not already in jsPlumbConnections before creating it
      const list = this.jsPlumbInstance.getConnections().filter(el => el.sourceId === connection.sourceId && el.targetId === connection.targetId )
      return list.length === 0
    }.bind(this))

    // configure connection
    this.jsPlumbInstance.bind('click', function (connection) {
      connection.setType('selected')

      const firstId = connection.sourceId.replace('source_', '')
      const secondId = connection.targetId.replace('target_', '')
      const connectionClass = 'connection-' + firstId + '-' + secondId
      const positions = getPopoverPosition(connectionClass, this.props.item.id)
      const solutionIndex = this.props.item.solutions.findIndex(el => el.firstId === firstId && el.secondSetId === secondId)

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
    this.jsPlumbInstance.removeAllEndpoints(elemId)
    this.props.onChange(
      actions.removeItem(isLeftSet, id)
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
    window.setTimeout(function () {
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
    }.bind(this), 100)

  }

  removeConnection(firstId, secondId){
    this.jsPlumbInstance.detach(this.state.jsPlumbConnection)
    this.setState({
      popover: {
        visible: false
      },
      jsPlumbConnection: null,
      current: null
    })
    // also delete the corresponding solution in props
    this.props.onChange(
      actions.removeSolution(firstId, secondId)
    )
  }

  closePopover(){
    this.setState({popover: {visible: false}})
    const list = this.jsPlumbInstance.getConnections()
    for(const conn of list){
      let type = 'valid'
      const firstId = conn.sourceId.replace('source_', '')
      const secondId = conn.targetId.replace('target_', '')
      const solution = this.props.item.solutions.find(solution => solution.firstId === firstId && solution.secondId === secondId)
      if(undefined !== solution && solution.score <= 0){
        type = 'invalid'
      }
      conn.setType(type)
    }
  }

  // click outside the popover but inside the question items row will close the popover
  handlePopoverFocusOut(event){
    const elem = event.target.closest('#popover-place-holder-' + this.props.item.id)
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
      this.jsPlumbInstance.repaintEverything()
    }
  }

  componentWillUnmount(){
    // jsPlumb.detachEveryConnection()
    // use reset instead of deleteEveryEndpoint because reset also remove event listeners
    jsPlumb.reset()
    this.jsPlumbInstance = null
    delete this.jsPlumbInstance
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
                onClick={() => this.props.onChange(actions.addItem(true))}
              >
                <span className="fa fa-plus"/>
                {tex('match_add_item')}
              </button>
            </div>
          </div>
          <div id={`popover-place-holder-${this.props.item.id}`} className="popover-container">
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
                onClick={() => this.props.onChange(actions.addItem(false))}
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
      firstId: T.string.isRequired,
      secondId: T.string.isRequired,
      score: T.number.isRequired,
      feedback: T.string
    })).isRequired,
    _errors: T.object
  }).isRequired,
  onChange: T.func.isRequired
}

export {Match}
