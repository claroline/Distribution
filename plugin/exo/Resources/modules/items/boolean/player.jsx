import React, {Component, PropTypes as T} from 'react'
import classes from 'classnames'
import cloneDeep from 'lodash/cloneDeep'

class Item extends Component {
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div
        onClick={this.props.onClick}
        className={classes(
          'choice',
          {'selected': this.props.selected}
        )}>
        <div dangerouslySetInnerHTML={{__html: this.props.choice.data}}  />
      </div>
    )
  }
}

Item.propTypes = {
  choice: T.shape({
    id: T.string.isRequired,
    data: T.string.isRequired
  }).isRequired,
  selected: T.bool.isRequired,
  onClick: T.func.isRequired
}

class BooleanPlayer extends Component {
  constructor(props){
    super(props)
    this.state = {
      selected: undefined
    }
  }

  handleItemClick(choice) {
    this.setState({selected: choice.id})
    const answer = cloneDeep(this.props.answer)
    this.props.onChange(
      Object.assign(answer, {id: choice.id})
    )
  }

  render(){
    return (
      <div className="boolean-player">
        {this.props.item.choices.map(choice =>
          <Item
            key={choice.id}
            selected={this.state.selected && this.state.selected === choice.id ? true : false}
            onClick={() => this.handleItemClick(choice)} choice={choice}/>
        )}
      </div>
    )
  }

}

BooleanPlayer.propTypes = {
  item: T.shape({
    choices: T.arrayOf(T.shape({
      id: T.string.isRequired,
      data: T.string.isRequired
    })).isRequired
  }).isRequired,
  answer: T.object.isRequired,
  onChange: T.func.isRequired
}


BooleanPlayer.defaultProps = {
  answer: {}
}

export {BooleanPlayer}
