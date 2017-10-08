import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import cloneDeep from 'lodash/cloneDeep'
import {FileThumbnail} from '#/main/core/layout/form/components/field/file-thumbnail.jsx'

export class File extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: props.value || []
    }
  }

  addFile(file) {
    if (file && (!this.props.max || this.state.files.length < this.props.max)) {
      const files = cloneDeep(this.state.files)
      files.push(file)
      this.setState({files: files}, () => this.props.onChange(this.state.files))
    }
  }

  removeFile(idx) {
    const files = cloneDeep(this.state.files)
    files.splice(idx, 1)
    this.setState({files: files}, () => this.props.onChange(this.state.files))
  }


  getFileType(mimeType) {
    const typeParts = mimeType.split('/')
    const type = typeParts.length > 0 ? typeParts[0] : 'file'

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
          onChange={() => this.addFile(this.input.files[0])}
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
  onChange: T.func.isRequired
}

File.defaultProps = {
  disabled: false,
  types: [],
  max: 1,
  onChange: () => {}
}
