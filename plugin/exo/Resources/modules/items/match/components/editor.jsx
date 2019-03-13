import React, {Component} from 'react'
import {tex, trans} from '#/main/app/intl/translation'

import {PropTypes as T} from 'prop-types'
import Popover from 'react-bootstrap/lib/Popover'
import classes from 'classnames'
import get from 'lodash/get'

import {Textarea} from '#/main/core/layout/form/components/field/textarea'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {utils} from './../utils/utils'

import {FormData} from '#/main/app/content/form/containers/data'


function getPopoverPosition(connectionClass, id) {
  const containerRect =  document.getElementById('popover-place-holder-' + id).getBoundingClientRect()
  const connectionRect =  document.querySelectorAll('.' + connectionClass)[0].getBoundingClientRect()
  // only compute top position
  return {
    top:  connectionRect.top + connectionRect.height / 2 - containerRect.top
  }
}

function drawSolutions(solutions, jsPlumbInstance) {
  for (const solution of solutions) {
    const connection = jsPlumbInstance.connect({
      source: 'source_' + solution.firstId,
      target: 'target_' + solution.secondId,
      type: solution.score > 0 ? 'expected':'unexpected'
    })

    const connectionClass = 'connection-' + solution.firstId + '-' + solution.secondId
    if (connection) { // connection doesn't exist in tests has jsPlumb is mocked
      connection.addClass(connectionClass)
    }
  }
}

class MatchLinkPopover extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showFeedback : false
    }
  }

  render() {
    return (
      <Popover
        id={`popover-${this.props.solution.firstId}-${this.props.solution.secondId}`}
        positionTop={this.props.popover.top}
        placement="bottom"
        title={
          <div>
            {tex('match_edit_connection')}

            <div className="popover-actions">
              <Button
                id={`match-connection-${this.props.solution.firstId}-${this.props.solution.secondId}-delete`}
                className="btn-link"
                type={CALLBACK_BUTTON}
                icon="fa fa-fw fa-trash-o"
                label={trans('delete', {}, 'actions')}
                disabled={!this.props.solution._deletable}
                callback={() => this.props.solution._deletable &&
                  this.props.handleConnectionDelete(this.props.solution.firstId, this.props.solution.secondId)
                }
                tooltip="top"
              />

              <Button
                id={`match-connection-${this.props.solution.firstId}-${this.props.solution.secondId}-close`}
                className="btn-link"
                type={CALLBACK_BUTTON}
                icon="fa fa-fw fa-times"
                label={trans('close', {}, 'actions')}
                callback={() => this.props.handlePopoverClose()}
                tooltip="top"
              />
            </div>
          </div>
        }
      >
        <div className="association">
          <input
            className="form-control association-score"
            onChange={
              e => this.props.onChange(
                actions.updateSolution(this.props.solution.firstId, this.props.solution.secondId, 'score', e.target.value)
              )
            }
            type="number"
            value={this.props.solution.score}
          />
          <Button
            id={`solution-${this.props.solution.firstId}-${this.props.solution.secondId}-feedback-toggle`}
            className="btn-link"
            type={CALLBACK_BUTTON}
            icon="fa fa-fw fa-comments-o"
            label={tex('feedback_association_created')}
            callback={() => this.setState({showFeedback: !this.state.showFeedback})}
            tooltip="top"
          />
        </div>
        {this.state.showFeedback &&
            <div className="feedback-container">
              <Textarea
                id={`solution-${this.props.solution.firstId}-${this.props.solution.secondId}-feedback`}
                value={this.props.solution.feedback}
                onChange={feedback => this.props.onChange(
                  actions.updateSolution(this.props.solution.firstId, this.props.solution.secondId, 'feedback', feedback)
                )}
              />
            </div>
        }
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
      <div className={classes('answer-item match-item', this.props.type)} id={this.props.type + '_' + this.props.item.id}>
        {this.props.type === 'source' &&
          <div className="left-controls">
            <Button
              id={`match-source-${this.props.item.id}-delete`}
              className="btn-link"
              type={CALLBACK_BUTTON}
              icon="fa fa-fw fa-trash-o"
              label={trans('delete', {}, 'actions')}
              disabled={!this.props.item._deletable}
              callback={() => this.props.item._deletable && this.props.onUnmount(
                true, this.props.item.id, this.props.type + '_' + this.props.item.id
              )}
              tooltip="top"
            />
          </div>
        }

        <div className="text-fields">
          <Textarea
            id={`${this.props.type}-${this.props.item.id}-data`}
            value={this.props.item.data}
            onChange={data => this.props.onChange(
              actions.updateItem(this.props.type === 'source', this.props.item.id, data)
            )}
          />
        </div>

        {this.props.type === 'target' &&
          <div className="right-controls">
            <Button
              id={`match-target-${this.props.type + '_' + this.props.item.id}-delete`}
              className="btn-link"
              type={CALLBACK_BUTTON}
              icon="fa fa-fw fa-trash-o"
              label={trans('delete', {}, 'actions')}
              disabled={!this.props.item._deletable}
              callback={() => this.props.item._deletable && this.props.onUnmount(
                false, this.props.item.id, this.props.type + '_' + this.props.item.id
              )}
              tooltip="top"
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

class MatchEditor extends Component {

  constructor(props) {
    super(props)
    
    this.jsPlumbInstance = utils.getJsPlumbInstance()
    this.container = null

    this.state = {
      popover: {
        visible: false,
        top: 0
      },
      jsPlumbConnection: null,
      current: null
    }

    this.handleTextEditorSwitch = this.handleTextEditorSwitch.bind(this)
    this.handleWindowResize = this.handleWindowResize.bind(this)
  }

  handleTextEditorSwitch(event) {
    // @TODO find a better way to ensure that we are clicking on the text-editor button
    if (event.target.className === 'toolbar-toggle fa fa-minus-circle' || event.target.className ===  'toolbar-toggle fa fa-plus-circle') {
      window.setTimeout(() => {
        this.jsPlumbInstance.repaintEverything()
      }, 300)
    }
  }

  handleWindowResize() {
    this.jsPlumbInstance.repaintEverything()
  }

  componentDidMount() {
    this.jsPlumbInstance.setContainer(this.container)
    // events that need to call jsPlumb repaint method...
    this.container.addEventListener('click', this.handleTextEditorSwitch)
    window.addEventListener('resize', this.handleWindowResize)

    // we have to wait for elements to be at there right place before drawing... so... timeout
    window.setTimeout(() => {
      drawSolutions(this.props.item.solutions , this.jsPlumbInstance)
    }, 500)

    // use this event to create solutions instead of 'connection' event
    this.jsPlumbInstance.bind('beforeDrop', (connection) => {
      // check that the connection is not already in jsPlumbConnections before creating it
      const list = this.jsPlumbInstance.getConnections().filter(el => el.sourceId === connection.sourceId && el.targetId === connection.targetId )

      if (list.length > 0) {
        return false
      }

      connection.connection.setType('selected')
      const firstId = connection.sourceId.replace('source_', '')
      const secondId = connection.targetId.replace('target_', '')
      const connectionClass = 'connection-' + firstId + '-' + secondId
      if (connection) {
        connection.connection.addClass(connectionClass)
      }
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
          top: positions.top
        },
        jsPlumbConnection: connection,
        current: solutionIndex
      })

      return true

    })

    // configure connection
    this.jsPlumbInstance.bind('click', (connection) => {
      connection.setType('selected')

      const firstId = connection.sourceId.replace('source_', '')
      const secondId = connection.targetId.replace('target_', '')
      const connectionClass = 'connection-' + firstId + '-' + secondId
      const positions = getPopoverPosition(connectionClass, this.props.item.id)
      const solutionIndex = this.props.item.solutions.findIndex(el => el.firstId === firstId && el.secondId === secondId)

      this.setState({
        popover: {
          visible: true,
          top: positions.top
        },
        jsPlumbConnection: connection,
        current: solutionIndex
      })
    })
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
      let type = 'expected'
      const firstId = conn.sourceId.replace('source_', '')
      const secondId = conn.targetId.replace('target_', '')
      const solution = this.props.item.solutions.find(solution => solution.firstId === firstId && solution.secondId === secondId)
      if (undefined !== solution && solution.score <= 0){
        type = 'unexpected'
      }
      conn.setType(type)
    }
  }

  // click outside the popover but inside the question items row will close the popover
  handlePopoverFocusOut(event){
    const elem = event.target.closest('#popover-place-holder-' + this.props.item.id)
    if (null === elem){
      this.closePopover()
    }
  }

  /**
   * We need to tell jsPlumb to repaint each time something make the form changing it's size
   * For now this handle :
   * - Error message show / hide
   * - Item deletion -> if any other item is below the one that is currently deleted it's follower will go up but the endpoint stay at the previous place
   */
  componentDidUpdate(prevProps){
    const repaint = (prevProps.item.firstSet.length > this.props.item.firstSet.length || prevProps.item.secondSet.length > this.props.item.secondSet.length) || get(this.props.item, '_touched')
    if (repaint) {
      this.jsPlumbInstance.repaintEverything()
    }
  }

  componentWillUnmount(){
    this.container.removeEventListener('click', this.handleTextEditorSwitch)
    window.removeEventListener('resize', this.handleWindowResize)

    utils.resetJsPlumb()

    this.jsPlumbInstance = null
    delete this.jsPlumbInstance
  }

  // todo : make onClick={(event) => this.handlePopoverFocusOut(event)} work
  render() {
    return (<FormData
      className="match-editor"
      embedded={true}
      name={this.props.formName}
      dataPart={this.props.path}
      sections={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'penalty',
              type: 'number',
              label: tex('editor_penalty_label'),
              required: true
            },
            {
              name: 'random',
              type: 'boolean',
              label: tex('editor_penalty_label'),
              required: true
            },
            {
              name: 'solutions',
              required: true,
              render: (item, errors) => {
                const MatchElements = <div
                  id={`match-question-editor-id-${item.id}`}
                  className="match-items row"
                  ref={(el) => { this.container = el }}
                >
                  <div className="item-col col-md-5 col-sm-5 col-xs-5">
                    <ul>
                      {item.firstSet.map((item) =>
                        <li key={'source_' + item.id}>
                          <MatchItem
                            onChange={this.props.onChange}
                            onMount={(type, id) => this.itemDidMount(type, id)}
                            onUnmount={(isLeftSet, id, elemId) => this.itemWillUnmount(isLeftSet, id, elemId)}
                            item={item}
                            type="source"
                          />
                        </li>
                      )}
                    </ul>
                    <div className="footer">
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={() => this.props.onChange(actions.addItem(true))}
                      >
                        <span className="fa fa-fw fa-plus"/>
                        {tex('match_add_item')}
                      </button>
                    </div>
                  </div>

                  <div id={`popover-place-holder-${item.id}`} className="divide-col col-md-2 col-sm-2 col-xs-2">
                    { this.state.popover.visible &&
                        <MatchLinkPopover
                          handleConnectionDelete={(firstId, secondId) => this.removeConnection(firstId, secondId)}
                          handlePopoverClose={() => this.closePopover()}
                          popover={this.state.popover}
                          solution={item.solutions[this.state.current]}
                          onChange={this.props.onChange}
                        />
                    }
                  </div>

                  <div className="item-col col-md-5 col-sm-5 col-xs-5">
                    <ul>
                      {item.secondSet.map((item) =>
                        <li key={'target_' + item.id}>
                          <MatchItem
                            onChange={this.props.onChange}
                            onMount={(type, id) => this.itemDidMount(type, id)}
                            onUnmount={(isLeftSet, id, elemId) => this.itemWillUnmount(isLeftSet, id, elemId)}
                            item={item}
                            type="target"
                          />
                        </li>
                      )}
                    </ul>

                    <div className="footer">
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={() => this.props.onChange(actions.addItem(false))}
                      >
                        <span className="fa fa-fw fa-plus"/>
                        {tex('match_add_item')}
                      </button>
                    </div>
                  </div>
                </div>
                
                return MatchElements
              }
            }
          ]
        }
      ]}
    />)
  }
}

  
export {MatchEditor}
