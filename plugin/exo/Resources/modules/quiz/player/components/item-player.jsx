import React, {PropTypes as T} from 'react'

const Hints = () =>
  <div>
    This is the hint section
  </div>

Hints.propTypes = {
  hints: T.array.isRequired
}

export const ItemPlayer = props =>
  <div className="item-player">
    {props.item.title &&
      <content className="item-title" dangerouslySetInnerHTML={{__html: props.item.title}} />
    }
    {props.item.description &&
      <content>
        <div className="item-description" dangerouslySetInnerHTML={{__html: props.item.description}}/>
      </content>
    }
    <content className="item-content">
      <strong dangerouslySetInnerHTML={{__html: props.item.content}}/>
    </content>

    {props.children}
    {props.item.hints && 0 !== props.item.hints.length &&
      <Hints hints={props.item.hints}/>
    }
  </div>

ItemPlayer.propTypes = {
  item: T.shape({
    title: T.string.isRequired,
    description: T.string.isRequired,
    content: T.string.isRequired,
    hints: T.array
  }).isRequired,
  children: T.node.isRequired
}
