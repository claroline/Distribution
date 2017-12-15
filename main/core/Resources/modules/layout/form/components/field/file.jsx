import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import cloneDeep from 'lodash/cloneDeep'
import {FileThumbnail} from '#/main/core/layout/form/components/field/file-thumbnail.jsx'
//this is not pretty
import {connect} from 'react-redux'
import {actions} from '#/main/core/data/form/actions.js'

class File extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: props.value || []
    }
  }

  isTypeAllowed(type) {
    let isAllowed = this.props.types.length === 0

    if (!isAllowed) {
      const regex = new RegExp(type, 'gi')
      this.props.types.forEach(t => {
        if (t.match(regex)) {
          isAllowed = true
        }
      })
    }

    return isAllowed
  }

  addFile(file) {
    if (file && (!this.props.max || this.state.files.length < this.props.max)) {
      const type = this.getFileType(file.type)

      if (this.isTypeAllowed(type)) {
        const files = cloneDeep(this.state.files)
        files.push(file)
        this.setState({files: files}, () => this.props.onChange(this.state.files))
      }
    }
  }

  removeFile(idx) {
    const files = cloneDeep(this.state.files)
    files.splice(idx, 1)
    this.setState({files: files}, () => this.props.onChange(this.state.files))
  }


  getFileType(mimeType) {
    const typeParts = mimeType.split('/')
    let type = 'file'

    if (typeParts[0] && ['image', 'audio', 'video'].indexOf(typeParts[0]) > -1) {
      type = typeParts[0]
    } else if (typeParts[1]) {
      type = typeParts[1]
    }

    return type
  }

  render() {
    return (
      <fieldset>
        <input
          id={this.props.controlId}
          type="file"
          className="form-control"
          accept={`${this.props.types.join(',')}`}
          ref={input => this.input = input}
          onChange={() => {

            if (this.input.files[0]) {
              const file = this.input.files[0]
              //this is default from Le Grand Maitre upload
              this.addFile(file)
              //this is copy pasted from content-input.jsx from exo bundle
              if (this.props.autoUpload) {
                this.props.uploadFile(file, this.props.uploadUrl, this.props.onUpload)
              }
            }
          }
        }
        />
        <div className="file-thumbnails">
          {this.state.files.map((f, idx) =>
            <FileThumbnail
              key={`file-thumbnail-${idx}`}
              type={!f.mimeType ? 'file' : this.getFileType(f.mimeType)}
              data={f}
              canEdit={false}
              canExpand={false}
              canDownload={false}
              handleDelete={() => this.removeFile(idx)}
            />
          )}
        </div>
      </fieldset>
    )
  }
}

File.propTypes = {
  controlId: T.string.isRequired,
  value: T.array,
  disabled: T.bool.isRequired,
  types: T.arrayOf(T.string).isRequired,
  max: T.number.isRequired,
  onChange: T.func.isRequired,
  autoUpload: T.bool.isRequired,
  onUpload: T.func.isRequired,
  uploadUrl: T.array.isRequired,
  uploadFile: T.func.isRequired
}

File.defaultProps = {
  disabled: false,
  types: [],
  max: 1,
  autoUpload: false,
  onChange: () => {},
  onUpload: () => {},
  uploadFile: () => {},
  uploadUrl: ['apiv2_uploadedfile']
}

//this is not pretty
const ConnectedFile = connect(
  () => ({}),
  dispatch => ({uploadFile(file, url, callback) {
    dispatch(actions.uploadFile(file, url, callback))
  }})
)(File)

export {
  ConnectedFile as File
}
