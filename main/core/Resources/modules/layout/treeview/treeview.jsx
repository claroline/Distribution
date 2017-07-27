import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

class TreeNode extends Component {
  constructor(props) {
    super(props)
  }

  isChecked(el) {
    return this.props.options.selected.find(select => select.id === el.id) ? true: false
  }

  //not used anymore, flatten everything in a single array. Kinda usefull for searches so I keep it as of now
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
    if (el.children.length === 0) return false

    return this.props.options.selected.find(select => {
      let found = false
      if (el.children && el.children.length > 0) {
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

  onExpandNode(el, event) {
    event.target.checked ?
      this.props.onOpenNode(el):
      this.props.onCloseNode(el)
  }

  render() {
    return (
      <ul>
        {this.props.data.map(el =>
          (
            <li key={el.id}>
              {el.children.length > 0 &&
                <input
                  className="treeview-hidden"
                  type="checkbox"
                  id={'node' + el.id}
                  defaultChecked={this.hasChildChecked(el)}
                  onChange={(event) => this.onExpandNode(el, event)}
                />
              }
              {this.hasChildChecked(el)}
              {this.props.options.selectable &&
                <input type="checkbox"
                  defaultChecked={this.isChecked(el)}
                  name={this.props.options.name + '[]'} value={el.id}
                  onChange={() => this.props.onChange(el)}
                />
              }
              {el.children.length > 0 &&
                <label className="treeview-pointer" htmlFor={'node' + el.id}/>
              }
              <span className="treeview-content">{this.props.render(el)}</span>
              {el.children.length > 0 &&
                <TreeNode
                  data={el.children}
                  options={this.props.options}
                  onChange={this.props.onChange}
                  onOpenNode={this.props.onOpenNode}
                  onCloseNode={this.props.onCloseNode}
                  render={this.props.render}
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
      <div className="treeview">
        <TreeNode {...this.props} />
      </div>
    )
  }
}

TreeView.propTypes = {
  data: T.arrayOf(T.object).isRequired, //the datatree
  render: T.func, //custom renderer function
  options: T.shape({
    name: T.string, //checkbox base name
    selected: T.array,
    selectable: T.bool, //allow checkbox selection
    collapse: T.bool, //collapse the datatree
    cssProperties: {
      open: T.string, //default css for open node
      close: T.string //default css for closed node
    }
  }),
  onChange: T.func, //callback for when a node is changed (open or closed)
  onOpenNode: T.func, //callback for when a node is opened
  onCloseNode: T.func //callback for when a node is closed
}

TreeNode.propTypes = {
  data: T.arrayOf(T.object).isRequired, //the datatree
  render: T.func.isRequired, //custom renderer function
  options: T.shape({
    name: T.string, //checkbox base name
    selectable: T.bool.isRequired, //allow checkbox selection
    selected: T.array,
    collapse: T.bool.isRequired, //collapse the datatree
    cssProperties: {
      open: T.string, //default css for open node
      close: T.string //default css for closed node
    }
  }).isRequired,
  onChange: T.func.isRequired, //callback for when a node is changed (open or closed)
  onOpenNode: T.func.isRequired, //callback for when a node is opened
  onCloseNode: T.func.isRequired //callback for when a node is closed
}

TreeNode.defaultProps = {
  render: (el) => el.name,
  options: {
    selectable: false,
    collapse: true,
    cssProperties: {
      open: {},
      close: {}
    }
  },
  onChange: () => {},
  onOpenNode: () => {},
  onCloseNode: () => {}
}

export {TreeView}
