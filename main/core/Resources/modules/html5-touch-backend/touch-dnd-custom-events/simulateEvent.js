const allowedEvents = {
  'touchdrag': null,
  'touchdragend': null,
  'touchdragenter': null,
  'touchdragleave': null,
  'touchdragover': null,
  'touchdragstart': null,
  'touchdrop': null
}

function ensureParamsCorrect(type, touchEvent, dataTransfer, target) {
  if (!type || !touchEvent || !dataTransfer || !target) {
    throw new Error('simulateEvent: arguments can\'t be undefined')
  }

  if (!(type in allowedEvents)) {
    throw new Error(`simulateEvent: unrecognised event type: ${type}`)
  }
}

export default function simulateEvent(type, touchEvent, dataTransfer, target) {
  ensureParamsCorrect(type, touchEvent, dataTransfer, target)

  const touchDetails = touchEvent.changedTouches[0]
  const event = new Event(type, {'bubbles': true})

  event.altkey = touchEvent.altkey
  event.button = 0
  event.buttons = 1
  event.cancelBubble = false
  event.clientX = touchDetails.clientX
  event.clientY = touchDetails.clientY
  event.ctrlKey = touchEvent.ctrlKey
  event.dataTransfer = dataTransfer
  event.layerX = 0
  event.layerY = 0
  event.metaKey = false
  event.movementX = 0
  event.movementY = 0
  event.offsetX = touchDetails.pageX - target.offsetLeft
  event.offsetY = touchDetails.pageY - target.offsetTop
  event.pageX = touchDetails.pageX
  event.pageY = touchDetails.pageY
  event.relatedTarget = touchEvent.relatedTarget
  event.returnValue = touchEvent.returnValue
  event.screenX = touchDetails.screenX
  event.screenY = touchDetails.screenY
  event.shiftKey = touchEvent.shiftKey
  event.sourceCapabilities = touchEvent.sourceCapabilities
  event.view = touchEvent.view
  event.which = 1
  event.x = touchDetails.clientX
  event.y = touchDetails.clientY

  target.dispatchEvent(event)
}
