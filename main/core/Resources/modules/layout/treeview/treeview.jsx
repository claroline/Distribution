import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

class TreeView extends Component {
  constructor(props) {
    super(props)
  }

  isChecked(el) {
      return this.props.options.selected.find(select => select.id === el.id) ? true: false
  }

  render() {
    return (
      <ul>
        {this.props.data.map(el =>
          (<li>
            {this.props.options.selectable &&
            <input
              type="checkbox"
              checked={this.isChecked(el)}
              name={this.props.options.name + '[]'} value={el.id}
              onChange={this.onChange}
            />
          } {el.name}
            <TreeView data={el.children} options={this.props.options}/>
          </li>)
        )}
      </ul>
    )
  }
}

TreeView.propTypes = {
  data: T.arrayOf(T.object).isRequired,
  renderer: T.object,
  options: T.object
}

export {TreeView}
