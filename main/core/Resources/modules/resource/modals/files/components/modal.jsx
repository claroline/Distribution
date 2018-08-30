import cloneDeep from 'lodash/cloneDeep'
import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {Modal} from '#/main/app/overlay/modal/components/modal'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

import {makeId} from '#/main/core/scaffolding/id'
import {trans} from '#/main/core/translation'
import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {FileGroup} from '#/main/core/layout/form/components/group/file-group'

class ResourceFilesCreationModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      files: {}
    }
  }

  removeFile(id) {
    const files = cloneDeep(this.state.files)
    delete files[id]
    this.setState({files: files})
  }

  render() {
    return (
      <Modal
        {...omit(this.props, 'parent', 'add', 'createFiles')}
        icon="fa fa-fw fa-file-upload"
        title={trans('add_files', {}, 'resource')}
      >
        <div className="modal-body">
          <FileGroup
            label={trans('file')}
            multiple={true}
            autoUpload={false}
            onChange={(file) => {
              const files = cloneDeep(this.state.files)
              const id = makeId()
              files[id] = file
              this.setState({files: files}, () => console.log(this.state.files))
            }}
          />
        </div>

        <Button
          className="modal-btn btn"
          type={CALLBACK_BUTTON}
          primary={true}
          label={trans('create', {}, 'actions')}
          disabled={0 === Object.keys(this.state.files).length}
          callback={() => this.props.createFiles(this.props.parent, this.state.files, () => {
            this.props.add(this.props.newNode)
            this.props.fadeModal()
          })}
        />
      </Modal>
    )
  }
}

ResourceFilesCreationModal.propTypes = {
  parent: T.shape(ResourceNodeTypes.propTypes).isRequired,
  add: T.func.isRequired,
  createFiles: T.func.isRequired,
  fadeModal: T.func.isRequired
}

export {
  ResourceFilesCreationModal
}