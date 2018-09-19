import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'
import omit from 'lodash/omit'
import set from 'lodash/set'

import {cleanErrors} from '#/main/app/content/form/utils'
import {Modal} from '#/main/app/overlay/modal/components/modal'
import {FormData} from '#/main/app/content/form/components/data'

import {trans} from '#/main/core/translation'
import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {actions} from '#/main/core/resources/file/store'

class FileFormModalComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {
        file: null
      },
      errors: {}
    }

    this.setErrors  = this.setErrors.bind(this)
    this.updateProp = this.updateProp.bind(this)
  }

  updateProp(propName, propValue) {
    const newData = cloneDeep(this.state.data)
    set(newData, propName, propValue)
    this.setState({data: newData})
  }

  setErrors(errors = {}) {
    this.setState({
      errors: cleanErrors(this.state.errors, errors)
    })
  }

  render() {
    return (
      <Modal
        {...omit(this.props, 'resourceNode', 'save')}
        icon="fa fa-fw fa-exchange-alt"
        title={trans('change_file', {}, 'resource')}
      >
        <FormData
          level={5}
          data={this.state.data}
          errors={this.state.errors}
          sections={[
            {
              title: trans('general'),
              primary: true,
              fields: [{
                name: 'file',
                type: 'file',
                label: trans('file'),
                required: true,
                options: {
                  autoUpload: false
                }
              }]
            }
          ]}
          setErrors={this.setErrors}
          updateProp={this.updateProp}
        >
          {this.props.children}
        </FormData>
        <button
          className="modal-btn btn btn-primary"
          disabled={!this.state.data.file}
          onClick={() => {
            this.props.save(this.props.resourceNode, this.state.data.file)
            this.props.fadeModal()
          }}
        >
          {trans('save')}
        </button>
      </Modal>
    )
  }
}

FileFormModalComponent.propTypes = {
  resourceNode: T.shape(
    ResourceNodeTypes.propTypes
  ).isRequired,
  save: T.func.isRequired,
  fadeModal: T.func.isRequired
}

const FileFormModal = connect(
  null,
  (dispatch) => ({
    save(node, file) {
      dispatch(actions.changeFile(node, file))
    }
  })
)(FileFormModalComponent)

export {
  FileFormModal
}
