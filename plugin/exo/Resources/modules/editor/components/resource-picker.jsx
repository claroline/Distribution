import React, {Component} from 'react'
const T = React.PropTypes
const PICKER_NAME = 'EXO_OBJECT_PICKER'
import {t} from './../lib/translate'

/* global Claroline */

class ResourcePicker extends Component {
  constructor(props){
    super(props)
    this.resourcePickerParams = {
      isPickerMultiSelectAllowed: this.props.isMultiSelect,
      typeWhiteList: this.props.allowedTypes,
      callback: (nodes) => {
        this.addResource(nodes)
        // Remove checked nodes for next time
        nodes = {}
      }
    }
  }

  addResource(nodes){
    if (typeof nodes === 'object' && nodes.length !== 0) {
      for (const key in nodes) {
        if (nodes.hasOwnProperty(key)) {
          const object = {
            nodeId: key,
            node: nodes[key]
          }
          this.props.onExitedObjectPicker(object)
          break
        }
      }
    }
  }

  togglePicker(){

    if (!Claroline.ResourceManager.hasPicker(PICKER_NAME)) {
      Claroline.ResourceManager.createPicker(PICKER_NAME, this.resourcePickerParams, true)
    } else {
      // Open existing picker
      Claroline.ResourceManager.picker(PICKER_NAME, 'open')
    }
  }

  render(){
    return(
      <div>
        <a role="button" onClick={this.togglePicker.bind(this)}>
          <i className="fa fa-folder-open"></i>&nbsp;{t('add_resource')}
        </a>
      </div>
    )
  }
}

ResourcePicker.propTypes = {
  onExitedObjectPicker: T.func.isRequired,
  title: T.string.isRequired,
  isMultiSelect: T.bool.isRequired,
  allowedTypes: T.arrayOf(T.string).isRequired
}

export {ResourcePicker}
