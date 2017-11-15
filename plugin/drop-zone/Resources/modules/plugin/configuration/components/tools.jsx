import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {t, trans} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {TextGroup}  from '#/main/core/layout/form/components/group/text-group.jsx'

import {actions} from '../actions'
import {generateId} from '../../../resources/dropzone/utils'

class Tools extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tool: {},
      showForm: false
    }
  }

  showForm() {
    const tool =  {
      id: generateId(),
      name: '',
      type: 0,
      data: {
        url: null,
        key: null
      }
    }
    this.setState({tool: tool, showForm: true})
  }

  saveTool() {
    this.props.saveTool(this.state.tool)
    this.setState({tool: {}, showForm: false})
  }

  updateTool(property, value) {
    const tool = Object.assign({}, this.state.tool, {[property]: value})
    this.setState({tool: tool})
  }

  updateToolData(property, value) {
    const data = Object.assign({}, this.state.tool.data, {[property]: value})
    const tool = Object.assign({}, this.state.tool, {data: data})
    this.setState({tool: tool})
  }

  render() {
    return (
      <div id="tools-container">
        {this.props.tools.length > 0 ?
          <table className="table corrections-table">
            <thead>
              <tr>
                <th>{t('name')}</th>
                <th>{t('type')}</th>
                <th>{trans('url', {}, 'dropzone')}</th>
                <th>{trans('key', {}, 'dropzone')}</th>
              </tr>
            </thead>
            <tbody>
            {this.props.tools.map(t =>
              <tr
                key={`tool-row-${t.id}`}
              >
                <td>{t.name}</td>
                <td>{t.type}</td>
                <td>{t.data.url}</td>
                <td>{t.data.key}</td>
              </tr>
            )}
            </tbody>
          </table> :
          <div className="alert alert-warning">
            {trans('no_tool', {}, 'dropzone')}
          </div>
        }
        {!this.state.showForm &&
          <button
            className="btn btn-primary"
            onClick={() => this.showForm()}
          >
            {trans('add_tool', {}, 'dropzone')}
          </button>
        }
        {this.state.showForm &&
          <form>
            <TextGroup
              controlId="tool-name"
              label={t('name')}
              value={this.state.tool.name}
              onChange={value => this.updateTool('name', value)}
            />
            <TextGroup
              controlId="tool-url"
              label={trans('url', {}, 'dropzone')}
              value={this.state.tool.data.url || ''}
              onChange={value => this.updateToolData('url', value)}
            />
            <TextGroup
              controlId="tool-key"
              label={trans('key', {}, 'dropzone')}
              value={this.state.tool.data.key || ''}
              onChange={value => this.updateToolData('key', value)}
            />
            <div className="btn-group">
              <button
                className="btn btn-default"
                onClick={() => this.setState({tool: {}, showForm: false})}
              >
                {t('cancel')}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => this.saveTool()}
              >
                {t('ok')}
              </button>
            </div>
          </form>
        }
      </div>

    )
  }
}

Tools.propTypes = {
  tools: T.array,
  saveTool: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    tools: state.tools
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveTool: (tool) => dispatch(actions.saveTool(tool)),
    showModal: (type, props) => dispatch(modalActions.showModal(type, props))
  }
}

const ConnectedTools = connect(mapStateToProps, mapDispatchToProps)(Tools)

export {ConnectedTools as Tools}