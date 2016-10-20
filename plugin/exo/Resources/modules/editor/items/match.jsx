import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {tex} from './../lib/translate'
import Popover from 'react-bootstrap/lib/Popover'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'

const T = React.PropTypes
/* global jsPlumb */

function handleBeforeDrop(data) {
  console.log('before drop')
  console.log(data)
  return true
}

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

  jsPlumb.setContainer(document.getElementById('match-question-container'))

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

function removeConnection(connection){
  if (connection._jsPlumb.hoverPaintStyle.strokeStyle === '#FC0000') {
    jsPlumb.detach(connection)
  }
}

function configConnection(connection, event){
  console.log(event)
  console.log(connection)

  let rootNode = document.getElementById('popover-place-holder')
  const rect = rootNode.getBoundingClientRect()
  console.log(event.screenY)
  console.log(rect.top)
  console.log(rootNode)
  const props = {
    data: {
      id:connection.sourceId + '-' + connection.targetId,
      layerX:event.layerX,
      layerY:event.layerY,
      screenX: event.screenX,
      screenY: event.screenY,
      left: event.screenX - rect.right,
      top: event.screenY - rect.top,
      title:connection.sourceId + '-' + connection.targetId,
      score: 1,
      feedback: ''
    }
  }

  //let rootNode = document.getElementById('popover-place-holder')
  while (rootNode.firstChild) {
    rootNode.removeChild(rootNode.firstChild)
  }
  ReactDOM.render(
    <MyPopOver {...props}/>, rootNode
  )

  /*ReactDOM.render(
    <MeModal {...props}/>, rootNode
  )*/
}

class MyPopOver extends Component {
  constructor(props){
    super(props)
    console.log('construct')
    console.log(this.props)
  }

  handleClick (){
    document.getElementById('match-popover').remove()
  }

  render() {

    return (
      // With overlay -> Invariant Violation: React.Children.only expected to receive a single React element child.
      <div id="match-popover" className="text-center">
      <Popover positionLeft={this.props.data.left} positionTop={this.props.data.top} placement="top" id={this.props.data.id} title={this.props.data.title}>
        <label>Score</label>
        <input type="number" value={this.props.data.score}></input>
        <label>Feedback</label>
        <textarea value={this.props.data.feedback}></textarea>
        <Button onClick={this.handleClick.bind(this)}>Close Popover</Button>
      </Popover>
      </div>
    )
  }
}

MyPopOver.propTypes = {
  data: T.object.isRequired
}

class ModalButton extends Component {
  constructor(props) {
    super(props)
    this.state = {show: false}
  }

  handleClick(){
    this.setState({show: !this.state.show})
    console.log(this)
    this.refs.modal.open()
  }

  render() {
    return (
      <Button onClick={this.handleClick.bind(this)}>
        <MeModal ref='modal'/>
        Open Modal
      </Button>
    )
  }

}

class MeModal extends Component {
  constructor(props) {
    super(props)
    this.state = {visible: false}
  }

  open() {
    this.setState({ visible: true })
  }

  close() {
    this.setState({ visible: false })
  }

  render () {
    return (
      <Modal show={this.state.visible} onHide={this.close.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Text in a modal</h4>
          <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>


          <hr />

          <h4>Overflowing text to show scroll behavior</h4>
          <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
          <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
          <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
          <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
          <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
          <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close.bind(this)}>Close</Button>
        </Modal.Footer>
      </Modal>

    )
  }
}


MeModal.propTypes = {
  visible: T.bool
}

class PopoverPlaceHolder extends Component {
  constructor(props) {
    super(props)
    this.state = {visible: false}
  }

  appendPopover(data) {
    console.log('show popover')
    //this.setState({ visible: !this.state.visible })
        /*var blahs = this.state.blah;
        blahs.push(blah);
        this.setState({ blah: blahs });*/
  }

  togglePopover() {
    console.log('show popover')
    this.setState({ visible: !this.state.visible })
        /*var blahs = this.state.blah;
        blahs.push(blah);
        this.setState({ blah: blahs });*/
  }

  render () {
    return (
      <div ref='popover-place-holder' id="popover-place-holder">
        {
          this.state.visible &&
          <h1>POPOVER !</h1>
        }
      </div>
    )
  }
}

class Match extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    initJsPlumb()
    addConnections()
    jsPlumb.bind('beforeDrop', function (data) {
      return handleBeforeDrop(data)
    })

    // remove one connection
    jsPlumb.bind('click', function (connection, event) {
      configConnection(connection, event)
    })

    jsPlumb.bind('dblclick', function (connection) {
      removeConnection(connection)
    })


  }

  render() {
    return (
      <div id="match-question-container" className="match-question-container">
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
              <hr/>
              <button className="btn btn-default">
                <i className="fa fa-plus"></i> &nbsp;Add a proposal
              </button>
            </div>
          </div>
          <div className="col-md-2">
            <PopoverPlaceHolder></PopoverPlaceHolder>
            <ModalButton />
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
              <i className="fa fa-plus"></i> &nbsp;Add a label
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export {Match}
