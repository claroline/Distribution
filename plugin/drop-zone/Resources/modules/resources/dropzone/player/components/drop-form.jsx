import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {t, trans} from '#/main/core/translation'
import {RadioGroup} from '#/main/core/layout/form/components/group/radio-group.jsx'
import {HtmlGroup}  from '#/main/core/layout/form/components/group/html-group.jsx'
import {TextGroup}  from '#/main/core/layout/form/components/group/text-group.jsx'
import {FileGroup}  from '#/main/core/layout/form/components/group/file-group.jsx'

import {constants} from '#/plugin/drop-zone/resources/dropzone/constants'

class DropTextForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
  }

  render() {
    return (
      <div id="drop-text-form">
        <HtmlGroup
          controlId="drop-text"
          label="drop_text"
          content={this.state.text}
          onChange={value => this.setState({text: value})}
          minRows={3}
          hideLabel={true}
        />
        <button
          className="btn btn-primary"
          disabled={!this.state.text}
          onClick={() => this.props.handleSubmit(this.state.text)}
        >
          {t('add')}
        </button>
      </div>
    )
  }
}

DropTextForm.propTypes = {
  handleSubmit: T.func.isRequired
}

class DropUrlForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: ''
    }
  }

  render() {
    return (
      <div id="drop-url-form">
        <TextGroup
          controlId="drop-url"
          label="drop_url"
          value={this.state.url}
          placeholder="http://..."
          onChange={value => this.setState({url: value})}
          hideLabel={true}
        />
        <button
          className="btn btn-primary"
          disabled={!this.state.url}
          onClick={() => this.props.handleSubmit(this.state.url)}
        >
          {t('add')}
        </button>
      </div>
    )
  }
}

DropUrlForm.propTypes = {
  handleSubmit: T.func.isRequired
}

class DropFileForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: []
    }
  }

  render() {
    return (
      <div id="drop-file-form">
        <FileGroup
          controlId="drop-file"
          label="drop_file"
          value={this.state.files}
          onChange={value => this.setState({files: value})}
          hideLabel={true}
          max={0}
        />
        <button
          className="btn btn-primary"
          disabled={this.state.files.length === 0}
          onClick={() => this.props.handleSubmit(this.state.files)}
        >
          {t('add')}
        </button>
      </div>
    )
  }
}

DropFileForm.propTypes = {
  handleSubmit: T.func.isRequired
}

export class DropForm extends Component {
  constructor(props) {
    super(props)
    const availableTypes = []

    if (props.params.uploadEnabled) {
      availableTypes.push(constants.DOCUMENT_TYPES.file)
    }
    if (props.params.richTextEnabled) {
      availableTypes.push(constants.DOCUMENT_TYPES.text)
    }
    if (props.params.urlEnabled) {
      availableTypes.push(constants.DOCUMENT_TYPES.url)
    }
    if (props.params.workspaceResourceEnabled) {
      availableTypes.push(constants.DOCUMENT_TYPES.resource)
    }
    this.state = {
      dropType: '',
      availableDropTypes: availableTypes
    }
    this.submitDrop = this.submitDrop.bind(this)
  }

  submitDrop(data) {
    this.props.saveDrop(this.state.dropType, data)
    this.setState({dropType: ''})
  }

  render() {
    return (
      <div id="drop-form">
        <h2>{trans('add_document', {}, 'dropzone')}</h2>
        {this.state.availableDropTypes.length > 0 &&
          <RadioGroup
            controlId="drop-type"
            label={trans('drop_type', {}, 'dropzone')}
            options={this.state.availableDropTypes}
            checkedValue={this.state.dropType}
            onChange={value => this.setState({dropType: value})}
          />
        }
        {this.state.dropType === constants.DOCUMENT_TYPES.file.value &&
          <DropFileForm
            handleSubmit={this.submitDrop}
          />
        }
        {this.state.dropType === constants.DOCUMENT_TYPES.text.value &&
          <DropTextForm
            handleSubmit={this.submitDrop}
          />
        }
        {this.state.dropType === constants.DOCUMENT_TYPES.url.value &&
          <DropUrlForm
            handleSubmit={this.submitDrop}
          />
        }
      </div>
    )
  }
}

DropForm.propTypes = {
  params: T.shape({
    uploadEnabled: T.bool,
    richTextEnabled: T.bool,
    urlEnabled: T.bool,
    workspaceResourceEnabled: T.bool
  }).isRequired,
  saveDrop: T.func.isRequired
}