import React, {Component, PropTypes as T} from 'react'
import {tex, t} from './../lib/translate'
import Popover from 'react-bootstrap/lib/Popover'
import classes from 'classnames'
import {Textarea} from './../components/form/textarea.jsx'
import {actions} from './match.js'


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
            <input className="form-control" onChange={this.handleScoreChange.bind(this)} type="number" value={this.props.solution.score}></input>
          </div>
          <div className="form-group">
            <label>Feedback</label>
            <textarea className="form-control" onChange={this.handleFeedbackChange.bind(this)} value={this.props.solution.feedback}></textarea>
          </div>
          <hr/>
          <div className="row">
            <div className="col-xs-12 text-center">
              <div className="btn-group">
                <button className="btn btn-default" onClick={() => this.props.handlePopoverClose()} title={'close'}>
                  <i className="fa fa-close"></i>
                </button>
                <button className="btn btn-default" onClick={() => this.props.handleConnectionDelete()} title={'delete'}>
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
      </Popover>
    )
  }
}

MatchLinkPopover.propTypes = {
  popover: T.object.isRequired,
  solution: T.object,
  handlePopoverClose: T.func.isRequired,
  handleConnectionDelete: T.func.isRequired
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
                className={classes('fa', 'fa-trash-o', {disabled: !this.props.item._deletable})}
                onClick={() => this.props.item._deletable && this.props.onChange(
                  actions.removeItem(true, this.props.item.id, this.props.type + '_' + this.props.item.id)
                )}
            />
          </div>
        }

        <div className="text-fields">
            <Textarea onChange={() => {}} id={`item-${this.props.item.id}-data`} className="form-control" content={this.props.item.data} />
        </div>
        { this.props.type === 'target' &&
          <div className="right-controls">
            <a  role="button"
                title={t('delete')}
                className={classes('fa', 'fa-trash-o', {disabled: !this.props.item._deletable})}
                onClick={() => this.props.item._deletable && this.props.onChange(
                  actions.removeItem(false, this.props.item.id, this.props.type + '_' + this.props.item.id)
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
  onChange: T.func.isRequired
}

class Match extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    this.props.onChange(actions.jsPlumbInit())

    //initJsPlumb()
    //addConnections(this.props.item.solutions)

    // new connection created event
    /*jsPlumb.bind('connection', function (data, event) {

      data.connection.setType('selected')
      const positions = getPopoverPosition(event)
      const firstSetId = data.sourceId.replace('source_', '')
      const secondSetId = data.targetId.replace('target_', '')
      const title = this.props.item.firstSet.find(el => el.id === firstSetId).data + ' - ' + this.props.item.secondSet.find(el => el.id === secondSetId).data
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

    jsPlumb.bind('beforeDrop', function (connection) {
      // check that the connection is not already in jsPlumbConnections before creating it
      const list = jsPlumb.getConnections().filter(el => el.sourceId === connection.sourceId && el.targetId === connection.targetId )
      return list.length === 0
    })

    // configure connection
    jsPlumb.bind('click', function (connection, event) {
      connection.setType('selected')
      const positions = getPopoverPosition(event)
      const firstSetId = connection.sourceId.replace('source_', '')
      const secondSetId = connection.targetId.replace('target_', '')
      const title = this.props.item.firstSet.find(el => el.id === firstSetId).data + ' - ' + this.props.item.secondSet.find(el => el.id === secondSetId).data
      const solution = this.props.item.solutions.find(el => el.firstId === firstSetId && el.secondId === secondSetId)
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
    }.bind(this))*/
  }

  /**
   * When adding a firstSet or secondSet item we need to add an jsPlumb endpoint to it
   * In order to achieve that we need to wait for the new item to be mounted
  */
  newItemDidMount(type, id){
    const isLeftItem = type === 'source'
    this.props.onChange(actions.jsPlumbAddEndpoint(isLeftItem, id))
  }

  removeConnection(){
    /*jsPlumb.detach(this.state.jsPlumbConnection)
    // TODO also delete the corresponding solution in props
    this.setState({
      popover: {
        visible: false
      },
      jsPlumbConnection: null,
      solution: null
    })*/
  }

  closePopover(){
    /*const list = jsPlumb.getConnections()
    for(const conn of list){
      conn.setType('default')
    }
    this.setState({popover: {visible: false}})*/
  }

  // click outside the popover but inside the question items row will close the popover
  handlePopoverFocusOut(event){
    const elem = event.target.closest('#popover-place-holder')
    if(null === elem){
      this.closePopover()
    }
  }


  // TODO handle RTE size change to repaint connections && endpoints
  handleTinyMceResize(){
    //jsPlumb.repaintEverything()
  }

  render() {
    return (
      <div id="match-question-container-id" className="match-question-container">
        <div className="form-group">
          <label htmlFor="set-penalty">{tex('match_question_penalty_label')}</label>
          <input
            id="set-penalty"
            value={this.props.item.penalty}
            title={tex('score')}
            type="number"
            className="form-control member-score"
          />
        </div>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={this.props.item.random}
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
                <MatchItem onChange={this.props.onChange} onMount={this.newItemDidMount.bind(this)} item={item} type="source" />
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
          <div id="popover-place-holder">
            { this.props.item._popover.visible &&
              <MatchLinkPopover
                handleConnectionDelete={this.removeConnection.bind(this)}
                handlePopoverClose={this.closePopover.bind(this)}
                popover={this.props.item._popover}
                solution={this.props.item._solution}
                />
            }

            { this.props.item._popover.visible &&
              <h1>popover should be visible</h1>
            }
          </div>
          <div className="item-col">
            <ul>
              {this.props.item.secondSet.map((item) =>
                <li key={'target_' + item.id}>
                  <MatchItem onChange={this.props.onChange} onMount={this.newItemDidMount.bind(this)} item={item} type="target" />
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
    firstSet: T.arrayOf(T.object).isRequired,
    secondSet: T.arrayOf(T.object).isRequired,
    solutions: T.arrayOf(T.object).isRequired,
    _solution: T.object.isRequired,
    _popover: T.object.isRequired,
    _jsPlumbConnection: T.object.isRequired
  }).isRequired,
  onChange: T.func.isRequired
}

export {Match}
