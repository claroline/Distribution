import {default as preview} from './dragPreview'
import {default as DataTransfer} from './DataTransfer'
import {default as simulateEvent} from './simulateEvent'

const dragOverInterval = 300

const touchDndCustomEvents = {
  'dataTransfer': null,
  'draggedItem': null,
  'lastDraggedOver': null,
  'dragOvers': null,
  'store': null
}

function handleTouchStart(event) {
  const target = event.target
  if (target.hasAttribute('draggable')) {
    event.preventDefault()

    const x = event.changedTouches[0].clientX
    const y = event.changedTouches[0].clientY

    const store = {}
    const dataTransfer = new DataTransfer(store)
    touchDndCustomEvents.store = store
    touchDndCustomEvents.dataTransfer = dataTransfer
    touchDndCustomEvents.draggedItem = target

    store.mode = 'readwrite'
    simulateEvent('touchdragstart', event, dataTransfer, target)

    const dragPreview = store.dragPreviewElement
    preview.updateDragPreview(dragPreview, x, y)
  }
}

function handleTouchMove(event) {
  if (touchDndCustomEvents.draggedItem) {
    event.preventDefault()

    const x = event.changedTouches[0].clientX
    const y = event.changedTouches[0].clientY
    const dataTransfer = touchDndCustomEvents.dataTransfer
    const draggedItem = touchDndCustomEvents.draggedItem
    const dragPreview = touchDndCustomEvents.store.dragPreviewElement
    const previewContainer = preview.updateDragPreview(dragPreview, x, y)

    touchDndCustomEvents.store.mode = 'readwrite'
    simulateEvent('touchdrag', event, dataTransfer, draggedItem)

    // hide dragPreview so we can get the element underneath
    previewContainer.hidden = true

    const draggedOver = document.elementFromPoint(x, y)

    // show dragPreview again
    previewContainer.hidden = false

    const lastDraggedOver = touchDndCustomEvents.lastDraggedOver
    if (lastDraggedOver !== draggedOver) {
      if (lastDraggedOver) {
        clearInterval(touchDndCustomEvents.dragOvers)
        simulateEvent('touchdragleave', event, dataTransfer, lastDraggedOver)
      }

      simulateEvent('touchdragenter', event, dataTransfer, draggedOver)

      touchDndCustomEvents.dragOvers = setInterval(function (){
        simulateEvent('touchdragover', event, dataTransfer, draggedOver)
      }, dragOverInterval)

      touchDndCustomEvents.lastDraggedOver = draggedOver
    }
  }
}

function handleTouchEnd(event) {
  if (touchDndCustomEvents.draggedItem) {
    event.preventDefault()

    const x = event.changedTouches[0].clientX
    const y = event.changedTouches[0].clientY
    const target = document.elementFromPoint(x, y)

    const dataTransfer = touchDndCustomEvents.dataTransfer

    // Ensure dragover event generation is terminated
    clearInterval(touchDndCustomEvents.dragOvers)

    touchDndCustomEvents.store.mode = 'readonly'
    simulateEvent('touchdrop', event, dataTransfer, target)

    touchDndCustomEvents.store.mode = 'protected'
    simulateEvent('touchdragend', event, dataTransfer, target)

    touchDndCustomEvents.store = null
    touchDndCustomEvents.dataTransfer = null
    touchDndCustomEvents.lastDraggedOver = null
    touchDndCustomEvents.draggedItem = null

    preview.removeDragPreview()
  }
}

export default function setupTouchDNDCustomEvents() {
  window.touchDndCustomEvents = touchDndCustomEvents

  var options = {
    capture: true,
    passive: false // indicate that the listener *WILL* call preventDefault()
  }

  document.addEventListener('touchstart', handleTouchStart, options)
  document.addEventListener('touchend', handleTouchEnd, options)
  document.addEventListener('touchmove', handleTouchMove, options)
}
