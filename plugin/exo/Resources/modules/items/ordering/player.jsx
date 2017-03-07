import React, {Component, PropTypes as T} from 'react'
import cloneDeep from 'lodash/cloneDeep'
import classes from 'classnames'
import {t} from './../../utils/translate'
import {MODE_INSIDE, MODE_BESIDE, DIRECTION_HORIZONTAL, DIRECTION_VERTICAL} from './editor'
import {makeSortable, SORT_HORIZONTAL, SORT_VERTICAL} from './../../utils/sortable'

let Item = props => {
  return props.connectDragPreview (
    props.connectDropTarget (
    <div className="item">
      <div className="item-data" dangerouslySetInnerHTML={{__html: props.data}} />
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

class OrderingPlayer extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if (this.props.item.mode === MODE_INSIDE && (this.props.answer.length === 0 || !this.props.answers)) {
      const answers = []
      this.props.item.items.forEach((item, index) => {
        answers.push({
          itemId: item.id,
          position: index + 1
        })
      })
      this.props.onChange(answers)
    }
  }

  onSort(id, swapId) {
    const newAnswer = cloneDeep(this.props.answer)
    // previous index of the dragged item
    const answerIndex = this.props.answer.findIndex(a => a.itemId === id)
    // new index of the dragged item
    const swapIndex = this.props.answer.findIndex(a => a.itemId === swapId)

    const tempAnswer = cloneDeep(this.props.answer.find(a => a.itemId === id))
    const tempSwap = cloneDeep(this.props.answer.find(a => a.itemId === swapId))
    tempAnswer.position = swapIndex + 1
    tempSwap.position = answerIndex + 1
    newAnswer[swapIndex] = tempAnswer
    newAnswer[answerIndex] = tempSwap

    return newAnswer
  }

  render() {

    return (
      <div className="ordering-player">
        <div className="row">
          <div className={classes(
              {'horizontal': this.props.item.direction === DIRECTION_HORIZONTAL},
              {'col-md-12': this.props.item.mode === MODE_INSIDE},
              {'col-md-6': this.props.item.direction === DIRECTION_VERTICAL && this.props.item.mode === MODE_BESIDE}
            )}>
            {this.props.item.mode === MODE_INSIDE ?
              this.props.answer.map((a, index) =>
                <Item
                  id={a.itemId}
                  key={a.itemId}
                  data={this.props.item.items.find(item => item.id === a.itemId).data}
                  index={index}
                  sortDirection={this.props.item.direction === DIRECTION_VERTICAL ? SORT_VERTICAL : SORT_HORIZONTAL}
                  onSort={
                  (id, swapId) => this.props.onChange(
                    this.onSort(id, swapId)
                  )}/>
              )
              :
              this.props.item.items.filter(item => undefined === this.props.answer.find(answer => answer.itemId === item.id)).map((item, index) =>
                <div key={item.id} dangerouslySetInnerHTML={{__html: item.data}}></div>
              )
          }
          </div>
          {this.props.item.direction === DIRECTION_VERTICAL && this.props.item.mode === MODE_BESIDE &&
            <div className="col-md-6 answer-zone">
              {this.props.answer.map((answer, index) => {
                <Item data={this.props.item.items.find(item => item.id = answer.itemId).data} index={index} onSort={() => {}}/>
              })}
              { this.props.answer.length === 0 &&
                <h4>Drop item here</h4>
              }
            </div>
          }
        </div>
        {this.props.item.direction === DIRECTION_HORIZONTAL && this.props.item.mode === MODE_BESIDE &&
          <div className="row">
            <div className="col-md-12 answer-zone">
              {this.props.answer.map((answer, index) => {
                <Item data={this.props.item.items.find(item => item.id = answer.itemId).data} index={index} onSort={() => {}}/>
              })}
              { this.props.answer.length === 0 &&
                <h4>Drop item here</h4>
              }
            </div>
          </div>
        }
      </div>
    )
  }

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

export {OrderingPlayer}
