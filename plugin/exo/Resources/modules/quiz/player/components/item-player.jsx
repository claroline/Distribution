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
    <header className="item-content">
      <strong dangerouslySetInnerHTML={{__html: props.item.content}}/>
    </header>
    {props.children}
    {props.item.hints && 0 !== props.item.hints.length &&
      <Hints hints={props.item.hints}/>
    }
  </div>

ItemPlayer.propTypes = {
  item: T.shape({
    content: T.string.isRequired,
    hints: T.array
  }).isRequired,
  children: T.node.isRequired
}
