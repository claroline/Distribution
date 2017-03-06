import React, {PropTypes as T} from 'react'
import classes from 'classnames'
import {MODE_INSIDE, MODE_BESIDE, DIRECTION_HORIZONTAL, DIRECTION_VERTICAL} from './editor'

export const OrderingPlayer = props =>  {
  return (
    <div className="ordering-player">
      <div className="row">
        <div className={classes(
            {'col-md-12': props.item.mode === MODE_INSIDE},
            {'col-md-6': props.item.direction === DIRECTION_VERTICAL && props.item.mode === MODE_BESIDE}
          )}>
        </div>
        {props.item.direction === DIRECTION_VERTICAL && props.item.mode === MODE_BESIDE &&
          <div className="col-md-6">
            DROP COL
          </div>
        }
      </div>
      {props.item.direction === DIRECTION_HORIZONTAL && props.item.mode === MODE_BESIDE &&
        <div className="row">
          <div className="col-md-12">
            DROP ROW
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
