import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import classes from 'classnames'

import {t} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'
import {makeModal, makeModalFromUrl} from '#/main/core/layout/modal'
import Configuration from '#/main/core/library/Configuration/Configuration'
import {select} from '#/main/core/administration/workspace/selectors'
import {actions} from '#/main/core/administration/workspace/actions'
import {DEFAULT_LIST_DISPLAYS, DEFAULT_LIST_DISPLAY} from '#/main/core/layout/list/default'

import {select as paginationSelect} from '#/main/core/layout/pagination/selectors'
import {select as listSelect} from '#/main/core/layout/list/selectors'

import {actions as listActions} from '#/main/core/layout/list/actions'
import { Page, PageHeader, PageContent} from '#/main/core/layout/page/components/page.jsx'
import { PageActions, PageAction } from '#/main/core/layout/page/components/page-actions.jsx'

import {DataList} from '#/main/core/layout/list/components/data-list.jsx'

const ActionCell = props =>
  <div className="table-actions">
    <button className="btn btn-link workspace-additional-action" onClick={() => props.removeWorkspaces([props.workspace])}>
      <span className="fa fa-trash workspace-action" />
    </button>

    {Configuration.getWorkspacesAdministrationActions().map(button => (
      <button type="button" className="btn btn-link workspace-additional-action">
        <span
          className={classes(button.class, 'workspace-action')}
          data-url={button.url(props.workspace.id)}
          data-toggle="tooltip"
          data-placement="left"
          title={button.name()}
          data-display-mode="modal_form"
        />
      </button>
    ))}
  </div>

ActionCell.propTypes = {
  workspace: T.object.isRequired,
  removeWorkspaces: T.func.isRequired
}

class Workspaces extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modal: {}
    }
  }

  removeWorkspaces(workspaces) {
    this.setState({
      modal: {
        type: 'DELETE_MODAL',
        urlModal: null,
        props: {
          url: null,
          isDangerous: true,
          question: t('remove_workspaces_confirm', {workspace_list: workspaces.reduce((acc, workspace) => workspace.name + ' ,')}),
          handleConfirm: () =>  {
            this.setState({modal: {fading: true}})

            return this.props.removeWorkspaces(workspaces)
          },
          title: t('remove_workspace')
        },
        fading: false
      }
    })
  }

  copySelection() {
    this.setState({
      modal: {
        urlModal: null,
        type: 'CONFIRM_MODAL',
        props: {
          url: null,
          isDangerous: false,
          question: t('copy_workspaces_confirm', {workspace_list: this.props.selected.reduce((acc, workspace) => workspace.name + ' ,')}),
          handleConfirm: () =>  {
            this.setState({modal: {fading: true}})

            return this.props.copyWorkspaces(this.props.selected, 0)
          },
          title: t('copy_workspace')
        },
        fading: false
      }
    })
  }

  copyAsModelSelection() {
    this.setState({
      modal: {
        type: 'CONFIRM_MODAL',
        url: null,
        props: {
          isDangerous: false,
          question: t('copy_model_workspaces_confirm', {workspace_list: this.props.selected.reduce((acc, workspace) => workspace.name + ' ,')}),
          handleConfirm: () =>  {
            this.setState({modal: {fading: true}})

            return this.props.copyWorkspaces(this.props.selected, 1)
          },
          title: t('copy_model_workspace')
        },
        fading: false
      }
    })
  }

  hideModal() {
    ReactDOM.unmountComponentAtNode(document.getElementById('url-modal'))
    this.setState({modal: {fading: true, urlModal: null}})
  }

  componentDidMount() {
    const els = document.getElementsByClassName('workspace-additional-action')
    const array = []
    //because it's an arrayNode collection or something, we can't use forEach directly
    array.forEach.call(els, el => {
      el.addEventListener(
        'click',
        event => {
          const node = event.target.querySelector('.workspace-action') || event.target
          const url = node.dataset.url
          const mode = node.dataset.displayMode

          if (mode === 'modal_form') {
            this.setState({
              modal: {
                type: 'URL_MODAL',
                fading: false,
                url
              }
            })
            {this.state.modal.type === 'URL_MODAL' &&
              this.props.createModalFromUrl(
                this.state.modal.fading,
                this.hideModal.bind(this),
                this.state.modal.url
              ).then(data => {
                this.setState({modal: { urlModal: data} })
                ReactDOM.render(data, document.getElementById('url-modal'))
              })
            }
          } else {
            window.location = url
          }
        }
      )
    })
  }

  render() {
    return (
      <Page
        fadeModal={() => true}
        hideModal={() => true}
      >
        <PageHeader title={t('workspaces_management')}>
          <PageActions>
            <PageAction
              id="workspace-add"
              title={t('create')}
              icon="fa fa-plus"
              primary={true}
              action={generateUrl('claro_workspace_creation_form')}
            />

            <PageAction
              id="workspaces-import"
              title={t('import_csv')}
              icon="fa fa-download"
              action={generateUrl('claro_admin_workspace_import_form')}
            />
          </PageActions>
        </PageHeader>

        <PageContent>
          {this.state.modal.type && this.state.modal.type !== 'URL_MODAL' &&
            this.props.createModal(
              this.state.modal.type,
              this.state.modal.props,
              this.state.modal.fading,
              this.hideModal.bind(this)
            )
          }
          <div id='url-modal'></div>

          <DataList
            data={this.props.data}
            totalResults={this.props.totalResults}

            definition={[
              {
                name: 'name',
                type: 'string',
                label: t('name'),
                renderer: (rowData) => <a href={generateUrl('claro_workspace_open', {workspaceId: rowData.id})} >{rowData.name}</a>
              },
              {name: 'code', type: 'string', label: t('code')},
              {name: 'is_model', type: 'boolean', label: t('is_model')},
              {name: 'displayable', type: 'boolean', label: t('displayable')},
              {name: 'creationDate', type: 'date', label: t('creationDate')},
              {name: 'maxStorageSize', type: 'string', label: t('maxStorageSize')},
              {name: 'maxUploadResources', type: 'number', label: t('maxUploadResources')},
              {name: 'maxUsers', type: 'number', label: t('maxUsers')}
            ]}

            display={{
              available: DEFAULT_LIST_DISPLAYS,
              current: DEFAULT_LIST_DISPLAY
            }}

            filters={{
              current: this.props.filters,
              addFilter: this.props.addListFilter,
              removeFilter: this.props.removeListFilter
            }}

            pagination={Object.assign({}, this.props.pagination, {
              handlePageChange: this.props.handlePageChange,
              handlePageSizeUpdate: this.props.handlePageSizeUpdate
            })}

            selection={{
              current: this.props.selected,
              toggle: this.props.onSelect,
              toggleAll: this.props.onSelect,
              actions: [
                {label: t('copy'), icon: 'fa fa-copy', action: () => this.copySelection(this.props.selected)},
                {label: t('make_model'), icon: 'fa fa-copy', action: () => this.copyAsModelSelection(this.props.selected)},
                {label: t('delete'), icon: 'fa fa-trash-o', action: () => this.removeWorkspaces(this.props.selected)}
              ]
            }}
          />
        </PageContent>
      </Page>
    )
  }
}

Workspaces.propTypes = {
  data: T.arrayOf(T.object),
  totalResults: T.number.isRequired,
  selected: T.arrayOf(T.object).isRequired,
  filters: T.array.isRequired,
  sortBy: T.object.isRequired,
  pagination: T.shape({
    pageSize: T.number.isRequired,
    current: T.number.isRequired
  }).isRequired,
  handlePageChange: T.func.isRequired,
  handlePageSizeUpdate: T.func.isRequired,

  addListFilter: T.func.isRequired,
  removeListFilter: T.func.isRequired,

  onSelect: T.func.isRequired,
  createModal: T.func.isRequired,
  createModalFromUrl: T.func.isRequired,
  removeWorkspaces: T.func.isRequired,
  copyWorkspaces: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    data: select.data(state),
    totalResults: select.totalResults(state),
    selected: select.selected(state),
    pagination: {
      pageSize: paginationSelect.pageSize(state),
      current:  paginationSelect.current(state)
    },
    filters: listSelect.filters(state),
    sortBy: listSelect.sortBy(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addListFilter: (property, value) => dispatch(listActions.addFilter(property, value)),
    removeListFilter: (filter) => dispatch(listActions.removeFilter(filter)),
    handlePageSizeUpdate: () => true,
    handlePageChange: (page, size) => {
      dispatch(actions.fetchPage(page, size))
    },
    onSelect: (selected) => dispatch(actions.onSelect(selected)),
    createModal: (type, props, fading, hideModal) => makeModal(type, props, fading, hideModal, hideModal),
    createModalFromUrl: (fading, hideModal, url) => makeModalFromUrl(fading, hideModal, url),
    removeWorkspaces: (workspaces) => dispatch(actions.removeWorkspaces(workspaces)),
    copyWorkspaces: (workspaces, isModel) => dispatch(actions.copyWorkspaces(workspaces, isModel))
  }
}

const ConnectedWorkspaces = connect(mapStateToProps, mapDispatchToProps)(Workspaces)

export {ConnectedWorkspaces as Workspaces}
