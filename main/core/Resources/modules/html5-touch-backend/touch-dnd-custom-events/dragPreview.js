const ID = 'touchDndPreviewContainer'

function addDragPreview(preview) {
  const container = document.createElement('div')

  container.id = ID
  container.appendChild(preview)
  document.body.appendChild(container)

  return container
}

function removeDragPreview() {
  const container = document.getElementById(ID)
  if (container) { document.body.removeChild(container) }
}

function updateDragPreview(preview, x, y) {
  const container = document.getElementById(ID) || addDragPreview(preview)

  container.style.position = 'fixed'
  container.style.top = `${y + preview.dragPointOffsetY}px`
  container.style.left = `${x + preview.dragPointOffsetX}px`
  container.style.width = `${preview.width}px`
  container.style.height = `${preview.height}px`

  return container
}

export default {
  removeDragPreview,
  updateDragPreview
}
