import React, {PropTypes as T} from 'react'
import classes from 'classnames'
import {t} from './../../utils/translate'
import {MODE_INSIDE, MODE_BESIDE, DIRECTION_HORIZONTAL, DIRECTION_VERTICAL} from './editor'
import {makeSortable, SORT_HORIZONTAL, SORT_VERTICAL} from './../../utils/sortable'

let Item = props => {
  return props.connectDragPreview (
    props.connectDropTarget (
    <div>
      <div className="item" dangerouslySetInnerHTML={{__html: props.data}} />
        {props.connectDragSource(
          <span
            title={t('move')}
            draggable="true"
            className={classes(
              'tooltiped-button',
              'btn',
              'fa',
              'fa-bars',
              'drag-handle'
            )}
          />
        )}
    </div>
  ))
}

Item.propTypes = {
  data: T.string.isRequired,
  connectDragSource: T.func.isRequired,
  connectDragPreview: T.func.isRequired,
  connectDropTarget: T.func.isRequired,
  onSort: T.func.isRequired,
  index: T.number.isRequired
}

Item = makeSortable(Item, 'ORDERING_PLAYER_ITEM')

export const OrderingPlayer = props =>  {
  // items
  const items = props.item.mode === MODE_INSIDE ? props.item.items : props.item.items.filter(item => undefined === props.answer.find(answer => answer.itemId === item.id))
  return (
    <div className="ordering-player">
      <div className="row">
        <div className={classes(
            'text-center',
            {'col-md-12': props.item.mode === MODE_INSIDE},
            {'col-md-6': props.item.direction === DIRECTION_VERTICAL && props.item.mode === MODE_BESIDE}
          )}>
          {items.map((item, index) =>
            <Item key={item.id} data={item.data} index={index} onSort={() => {}}/>
          )}
        </div>
        {props.item.direction === DIRECTION_VERTICAL && props.item.mode === MODE_BESIDE &&
          <div className="col-md-6 text-center">
            {props.answer.map((answer, index) => {
              <Item data={props.item.items.find(item => item.id = answer.itemId).data} index={index} onSort={() => {}}/>
            })}
          </div>
        }
      </div>
      {props.item.direction === DIRECTION_HORIZONTAL && props.item.mode === MODE_BESIDE &&
        <div className="row">
          <div className="col-md-12">
            {props.answer.map((answer, index) => {
              <Item data={props.item.items.find(item => item.id = answer.itemId).data} index={index} onSort={() => {}}/>
            })}
          </div>
        </div>
      }
    </div>
  )
}

OrderingPlayer.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    direction: T.string.isRequired,
    mode: T.string.isRequired,
    items: T.arrayOf(T.object).isRequired
  }).isRequired,
  answer: T.array.isRequired,
  onChange: T.func.isRequired
}

OrderingPlayer.defaultProps = {
  answer: []
}
