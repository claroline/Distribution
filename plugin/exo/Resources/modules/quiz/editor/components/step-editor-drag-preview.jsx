import React, {PropTypes as T} from 'react'
import classes from 'classnames'
import Panel from 'react-bootstrap/lib/Panel'
import {trans} from './../../../utils/translate'
import {getDefinition} from './../../../items/item-types'
import {getContentDefinition} from './../../../contents/content-types'
import {Icon as ItemIcon} from './../../../items/components/icon.jsx'

const ItemHeaderPreview = props =>
  <div className="item-header">
    <span className="panel-title">
      <ItemIcon name={getDefinition(props.item.type).name}/>
      {props.item.title || trans(getDefinition(props.item.type).name, {}, 'question_types')}
    </span>
  </div>

ItemHeaderPreview.propTypes = {
  item: T.object.isRequired
}

export const ItemPanelDragPreview = props =>
  <div>
    <Panel header={<ItemHeaderPreview item={props.item}/>} />
  </div>


ItemPanelDragPreview.propTypes = {
  item: T.object.isRequired
}

const ContentHeaderPreview = props =>
  <div className="item-header">
    <span className="panel-title">
      <span className={classes('item-icon', 'item-icon-sm', getContentDefinition(props.item.type).altIcon)}></span>
      {props.item.title || trans(getContentDefinition(props.item.type).type, {}, 'question_types')}
    </span>
  </div>

ContentHeaderPreview.propTypes = {
  item: T.object.isRequired
}

export const ContentPanelDragPreview = props =>
  <div>
    <Panel header={<ContentHeaderPreview item={props.item}/>} />
  </div>

ContentPanelDragPreview.propTypes = {
  item: T.object.isRequired
}
