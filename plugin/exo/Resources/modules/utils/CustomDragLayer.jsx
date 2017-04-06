import React, { Component, PropTypes as T } from 'react'
import { DragLayer } from 'react-dnd'
import {isQuestionType} from './../items/item-types'
import {ContentThumbnailDragPreview} from './../contents/components/content-thumbnail-drag-preview.jsx'
import {ContentPanelDragPreview} from './../quiz/editor/components/step-editor-drag-preview.jsx'
import {ItemPanelDragPreview} from './../quiz/editor/components/item-panel-drag-preview.jsx'
import {
  BORDER_WIDTH,
  AREA_GUTTER
} from './../items/graphic/components/answer-area.jsx'

import {
  SHAPE_RECT,
  TYPE_ANSWER_AREA
} from './../items/graphic/enums'

import {
  ITEM,
  THUMBNAIL,
  CONTENT_THUMBNAIL,
  ORDERING_ITEM,
  STEP_ITEM
} from './../quiz/enums'

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  color: 'black'
}

function getItemStyles(props) {
  const { currentOffset } = props
  if (!currentOffset) {
    return {
      display: 'none'
    }
  }

  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`

  switch (props.itemType) {
    case TYPE_ANSWER_AREA:
    case STEP_ITEM : return {
      transform: transform,
      WebkitTransform: transform
    }
    default: return {
      transform: transform,
      WebkitTransform: transform,
      backgroundColor: '#aaa',
      textAlign: 'center',
      width: '100px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.5,
      borderRadius: '5px'
    }
  }
}

class CustomDragLayerComponent extends Component {
  renderItem(type, item) {
    switch (type) {
      case ITEM:
        return (
          item.item.data ? <div dangerouslySetInnerHTML={{__html: item.item.data}}></div> : <div>DRAGGING</div>
        )
      case THUMBNAIL:
        return (
          <div>{item.title}</div>
        )
      case CONTENT_THUMBNAIL:
        return (
          <ContentThumbnailDragPreview data={item.data} type={item.type} />
        )
      case ORDERING_ITEM:
        return (
          item.data ? <div dangerouslySetInnerHTML={{__html: item.data}}></div> : <div>DRAGGING</div>
        )
      case STEP_ITEM: {
        return (
          isQuestionType(item.item.type) ? <ItemPanelDragPreview item={item.item} /> : <ContentPanelDragPreview item={item.item} />
        )
      }
      case TYPE_ANSWER_AREA: {
        const isRect = item.shape === SHAPE_RECT
        const def = item.geometry
        const width = isRect ? def.coords[1].x - def.coords[0].x : def.radius * 2
        const height = isRect ? def.coords[1].y - def.coords[0].y : def.radius * 2
        const frameWidth = width + (AREA_GUTTER * 2)
        const frameHeight = height + (AREA_GUTTER * 2)
        const innerFrameWidth = frameWidth - BORDER_WIDTH * 2
        const innerFrameHeight = frameHeight - BORDER_WIDTH * 2
        const borderRadius = isRect ? 0 : def.radius
        return (
          <div style={{
            borderRadius: borderRadius,
            opacity: 0.5,
            width: innerFrameWidth + 'px',
            height: innerFrameHeight + 'px',
            backgroundColor: def.color
          }}/>
        )
      }
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props
    if (!isDragging) {
      return null
    }

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    )
  }
}

CustomDragLayerComponent.propTypes = {
  item: T.object,
  itemType: T.string,
  currentOffset: T.shape({
    x: T.number.isRequired,
    y: T.number.isRequired
  }),
  isDragging: T.bool.isRequired
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }
}

const CustomDragLayer = DragLayer(collect)(CustomDragLayerComponent)

export {CustomDragLayer}
