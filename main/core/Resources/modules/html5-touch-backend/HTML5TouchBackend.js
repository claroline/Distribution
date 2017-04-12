import setupTouchDNDCustomEvents from './touch-dnd-custom-events/index'

function addEventListeners(target) {
  this.addCustomEventListeners(target)
  this._addEventListeners(target)
}

function addCustomEventListeners(target) {
  target.addEventListener(
    'touchdragstart', this.handleTopDragStart
  )
  target.addEventListener(
    'touchdragstart', this.handleTopDragStartCapture, true
  )
  target.addEventListener(
    'touchdragend', this.handleTopDragEndCapture, true
  )
  target.addEventListener(
    'touchdragenter', this.handleTopDragEnter
  )
  target.addEventListener(
    'touchdragenter', this.handleTopDragEnterCapture, true
  )
  target.addEventListener(
    'touchdragleave', this.handleTopDragLeaveCapture, true
  )
  target.addEventListener(
    'touchdragover', this.handleTopDragOver
  )
  target.addEventListener(
    'touchdragover', this.handleTopDragOverCapture, true
  )
  target.addEventListener(
    'touchdrop', this.handleTopDrop
  )
  target.addEventListener(
    'touchdrop', this.handleTopDropCapture, true
  )
}

function removeEventListeners(target) {
  this.removeCustomEventListeners(target)
  this._removeEventListeners(target)
}

function removeCustomEventListeners(target) {
  target.removeEventListener(
    'touchdragstart', this.handleTopDragStart
  )
  target.removeEventListener(
    'touchdragstart', this.handleTopDragStartCapture, true
  )
  target.removeEventListener(
    'touchdragend', this.handleTopDragEndCapture, true
  )
  target.removeEventListener(
    'touchdragenter', this.handleTopDragEnter
  )
  target.removeEventListener(
    'touchdragenter', this.handleTopDragEnterCapture, true
  )
  target.removeEventListener(
    'touchdragleave', this.handleTopDragLeaveCapture, true
  )
  target.removeEventListener(
    'touchdragover', this.handleTopDragOver
  )
  target.removeEventListener(
    'touchdragover', this.handleTopDragOverCapture, true
  )
  target.removeEventListener(
    'touchdrop', this.handleTopDrop
  )
  target.removeEventListener(
    'touchdrop', this.handleTopDropCapture, true
  )
}

function connectDragPreview(sourceId, node, options) {
  this._connectDragPreview(sourceId, node, options)
}

function connectDragSource(sourceId, node, options) {
  setupTouchDNDCustomEvents()

  const _superReturn = this._connectDragSource(sourceId, node, options)

  const touchHandleDragStart = (e) => this.handleDragStart(e, sourceId)
  const touchHandleSelectStart = (e) => this.handleSelectStart(e, sourceId)

  node.addEventListener('touchdragstart', touchHandleDragStart)
  node.addEventListener('touchselectstart', touchHandleSelectStart)

  return () => {
    node.removeEventListener('touchdragstart', touchHandleDragStart)
    node.removeEventListener('touchselectstart', touchHandleSelectStart)
    _superReturn()
  }
}

function connectDropTarget(targetId, node) {
  const _superReturn = this._connectDropTarget(targetId, node)

  const touchHandleDragEnter = (e) => this.handleDragEnter(e, targetId)
  const touchHandleDragOver = (e) => this.handleDragOver(e, targetId)
  const touchHandleDrop = (e) => this.handleDrop(e, targetId)

  node.addEventListener('touchdragenter', touchHandleDragEnter)
  node.addEventListener('touchdragover', touchHandleDragOver)
  node.addEventListener('touchdrop', touchHandleDrop)

  return () => {
    node.removeEventListener('touchdragenter', touchHandleDragEnter)
    node.removeEventListener('touchdragover', touchHandleDragOver)
    node.removeEventListener('touchdrop', touchHandleDrop)
    _superReturn()
  }
}

export default class HTML5TouchBackend {
  constructor() {
    // Store bindings to prototype functions
    this._addEventListeners = this.addEventListeners.bind(this)
    this._removeEventListeners = this.removeEventListeners.bind(this)
    this._connectDragSource = this.connectDragSource.bind(this)
    this._connectDropTarget = this.connectDropTarget.bind(this)
    this._connectDragPreview = this.connectDragPreview.bind(this)

    // Bind to overridden versions of prototype functions
    this.addEventListeners = addEventListeners.bind(this)
    this.removeEventListeners = removeEventListeners.bind(this)
    this.connectDragSource = connectDragSource.bind(this)
    this.connectDropTarget = connectDropTarget.bind(this)
    this.connectDragPreview = connectDragPreview.bind(this)

    this.addCustomEventListeners = addCustomEventListeners.bind(this)
    this.removeCustomEventListeners = removeCustomEventListeners.bind(this)
  }
}
