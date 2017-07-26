import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import cloneDeep from 'lodash/cloneDeep'

class TreeNode extends Component {
  constructor(props) {
    super(props)
    //we flatten here so we run the function only once
    this.flatData = this.flatten(this.props.data)
  }

  isChecked(el) {
      return this.props.options.selected.find(select => select.id === el.id) ? true: false
  }

  findById(id) {
    return this.flatData.find(el => el.id === id)
  }

  flatten(array) {
    let flattened = []

    array.forEach(el => {
      flattened.push(el)
      if (Array.isArray(el.children)) {
        flattened = flattened.concat(this.flatten(el.children))
      }
    })

    return flattened
  }

  //this is not really optimized yet but I guess that's okay
  hasChildChecked(el) {
      //no child, no point looking
      console.log('has child ' + el.id, this.props.options.selected)
      if (el.children.length === 0) return false

      return this.props.options.selected.find(select => {
        const object = this.findById(select.id) //= el
        let found = false
        if (object && object.children && object.children.length > 0) {

          el.children.forEach(child => {

            if (child.id === select.id) found = true
            if (!found) found = this.hasChildChecked(child)
          })
        }
        return found
      }) ? true: false
  }

  isNodeOpen(el) {
    return this.props.options.collapse ? false: this.hasChildChecked(el)
  }

  render() {
    return (
      <ul>
        {this.props.data.map(el =>
          (
            <li>
              {el.children.length > 0 &&
                <input
                  type="checkbox"
                  id={"node" + el.id}
                  defaultChecked={this.hasChildChecked(el)}
                />
              }
              <label>
                {this.hasChildChecked(el)}
                {this.props.options.selectable &&
                  <input type="checkbox"
                    defaultChecked={this.isChecked(el)}
                    name={this.props.options.name + '[]'} value={el.id}
                    onChange={() => this.props.onChange(el)}
                  />
                }
                <span></span>
              </label>
              <label htmlFor={"node" + el.id}>
                {el.name}
              </label>
              {el.children.length > 0 &&
                <TreeNode
                  data={el.children}
                  options={this.props.options}
                  onChange={this.props.onChange}
                />
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
  data: T.arrayOf(T.object).isRequired, //the datatree
  renderer: T.object, //custom renderer function
  options: T.shape({
    name: T.string, //checkbox base name
    selectable: T.bool, //allow checkbox selection
    collapse: T.bool, //collapse the datatree
    autoSelect: T.bool, //automatically select children
    css: {
      open: T.string, //default css for open node
      close: T.string //default css for closed node
    }
  }),
  onChange: T.func
}

TreeView.defaultProps = {
  options: {
    selectable: false,
    autoSelect: false,
    collapse: true,
    css: {
      open: {},
      close: {}
    }
  }
}

export {TreeView}
