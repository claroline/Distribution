import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_GENERIC_TYPE_PICKER} from '#/main/core/layout/modal'
import {constants as listConstants} from '#/main/core/data/list/constants'
import {
  PageContainer,
  PageHeader,
  PageContent,
  PageActions,
  PageAction
} from '#/main/core/layout/page'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'

import {constants} from '#/plugin/drop-zone/plugin/configuration/constants'
import {actions} from '#/plugin/drop-zone/plugin/configuration/actions'
import {generateId} from '#/plugin/drop-zone/resources/dropzone/utils'

class Tools extends Component {
  showCompilatioForm(tool = null) {
    const toolForm = !tool ?
    {
      id: generateId(),
      name: '',
      type: constants.compilatioValue,
      data: {
        url: 'http://service.compilatio.net/webservices/CompilatioUserClient2.wsdl',
        key: null
      }
    } :
    tool
    this.props.loadToolForm(toolForm)

    this.props.showModal('MODAL_COMPILATIO_FORM', {
      title: trans('compilatio_configuration', {}, 'dropzone')
    })
  }

  showForm() {
    this.props.showModal(MODAL_GENERIC_TYPE_PICKER, {
      title: trans('tool_type_selection_title', {}, 'dropzone'),
      types: constants.toolTypes,
      handleSelect: (type) => this.handleToolTypeSelection(type)
    })
  }

  handleToolTypeSelection(toolType) {
    this.props.fadeModal()

    switch (toolType.type) {
      case constants.compilatioValue:
        this.showCompilatioForm()
        break
    }
  }

  editTool(tool) {
    switch (tool.type) {
      case constants.compilatioValue:
        this.showCompilatioForm(tool)
        break
    }
  }

  generateColumns() {
    const columns = []

    columns.push({
      name: 'name',
      label: trans('name', {}, 'platform'),
      type: 'string',
      displayed: true
    })
    columns.push({
      name: 'type',
      label: trans('type', {}, 'platform'),
      type: 'number',
      displayed: true,
      renderer: (rowData) => {
        let type = rowData.type

        switch (type) {
          case constants.compilatioValue:
            type = 'Compilatio'
            break
        }

        return type
      }
    })
    columns.push({
      name: 'data',
      label: trans('data', {}, 'dropzone'),
      type: 'string',
      displayed: true,
      renderer: (rowData) => {
        let dataBox =
          <div>
            {Object.keys(rowData.data).map((k, idx) =>
              <div key={`data-row-${idx}`}>
                {trans(k, {}, 'dropzone')} : {rowData.data[k]}
              </div>
            )}
          </div>

        return dataBox
      }
    })

    return columns
  }

  generateActions() {
    const dataListActions = []

    dataListActions.push({
      icon: 'fa fa-fw fa-pencil',
      label: trans('edit_tool', {}, 'dropzone'),
      action: (rows) => this.editTool(rows[0]),
      context: 'row'
    })

    return dataListActions
  }

  render() {
    return (
      <PageContainer id="tools-container">
        <PageHeader
          title={trans('tools_management', {}, 'dropzone')}
          key="tools-container-header"
        >
          <PageActions>
            <PageAction
              id="theme-save"
              title={trans('add_tool', {}, 'dropzone')}
              icon="fa fa-plus"
              primary={true}
              action={() => this.showForm()}
            />
          </PageActions>
        </PageHeader>
        <PageContent key="tools-container-content">
          <DataListContainer
            name="tools"
            display={{
              current: listConstants.DISPLAY_TABLE,
              available: [listConstants.DISPLAY_TABLE]
            }}
            fetch={{
              url: ['apiv2_dropzonetool_list'],
              autoload: true
            }}
            delete={{
              url: ['apiv2_dropzonetool_delete_bulk']
            }}
            definition={this.generateColumns()}
            filterColumns={true}
            actions={this.generateActions()}
            card={() => ({
              onClick: () => {},
              poster: null,
              icon: null,
              title: '',
              subtitle: '',
              contentText: '',
              flags: [].filter(flag => !!flag),
              footer:
                <span></span>,
              footerLong:
                <span></span>
            })}
          />
        </PageContent>
      </PageContainer>
    )
  }
}

Tools.propTypes = {
  tools: T.object,
  loadToolForm: T.func.isRequired,
  showModal: T.func.isRequired,
  fadeModal: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    tools: state.tools
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadToolForm: (tool) => dispatch(actions.loadToolForm(tool)),
    showModal: (type, props) => dispatch(modalActions.showModal(type, props)),
    fadeModal: () => dispatch(modalActions.fadeModal())
  }
}

const ConnectedTools = connect(mapStateToProps, mapDispatchToProps)(Tools)

export {ConnectedTools as Tools}