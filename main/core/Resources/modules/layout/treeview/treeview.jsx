import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

class TreeNode extends Component {
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
          (
            <li>
              <input type="checkbox" id={"node" + el.id}/>
              <label>
                <input type="checkbox"
                  checked={this.isChecked(el)}
                  name={this.props.options.name + '[]'} value={el.id}
                  onChange={() => this.props.onChange(el)}
                />
                <span></span>
              </label>
              <label htmlFor={"node" + el.id}>{el.name}</label>
              {el.children.length > 0 &&
                <TreeNode data={el.children} options={this.props.options} onChange={this.props.onChange}/>
              }
            </li>)
          )
        }
      </ul>
    )
  }
}

class TreeView extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className="acidjs-css3-treeview">
        <TreeNode {...this.props} />
      </div>
    )
  }
}

TreeView.propTypes = {
  data: T.arrayOf(T.object).isRequired,
  renderer: T.object,
  options: T.object,
  onChange: T.func
}

export {TreeView}
