import React, {PropTypes as T} from 'react'
import classes from 'classnames'
import {MODE_INSIDE, MODE_BESIDE, DIRECTION_HORIZONTAL, DIRECTION_VERTICAL} from './editor'


const Item = props => {
  return (
    <div>
      <div className="item" dangerouslySetInnerHTML={{__html: props.data}} />     

    </div>

  )
}

Item.propTypes = {
  data: T.string.isRequired
}

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
          {props.answer.map(answer => {
            <Item data={props.item.items.find(item => item.id = answer.itemId).data}/>
          })}
        </div>
        {props.item.direction === DIRECTION_VERTICAL && props.item.mode === MODE_BESIDE &&
          <div className="col-md-6 text-center">
            {items.map(item => {
              <Item data={item.data}/>
            })}
          </div>
        }
      </div>
      {props.item.direction === DIRECTION_HORIZONTAL && props.item.mode === MODE_BESIDE &&
        <div className="row">
          <div className="col-md-12">
            {props.answer.map(answer => {
              <Item data={props.item.items.find(item => item.id = answer.itemId).data}/>
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
