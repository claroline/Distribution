import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t, transChoice} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'
import {makeModal, makeModalFromUrl} from '#/main/core/layout/modal'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {MODAL_CONFIRM} from '#/main/core/layout/modal'

import Configuration from '#/main/core/library/Configuration/Configuration'

import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {actions as paginationActions} from '#/main/core/layout/pagination/actions'
import {actions as listActions} from '#/main/core/layout/list/actions'
import {actions} from '#/main/core/administration/workspace/actions'

import {select as modalSelect} from '#/main/core/layout/modal/selectors'
import {select as paginationSelect} from '#/main/core/layout/pagination/selectors'
import {select as listSelect} from '#/main/core/layout/list/selectors'
import {select} from '#/main/core/administration/workspace/selectors'

import {Page, PageHeader, PageContent} from '#/main/core/layout/page/components/page.jsx'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'

import {LIST_PROP_DEFAULT, LIST_PROP_DISPLAYED} from '#/main/core/layout/list/utils'
import {DataList} from '#/main/core/layout/list/components/data-list.jsx'

class Workspaces extends Component {
  getWorkspaces(workspaceIds) {
    return workspaceIds.map(workspaceId => this.props.data.find(workspace => workspaceId === workspace.id))
  }

  removeWorkspaces(workspaceIds) {
    const workspaces = this.getWorkspaces(workspaceIds)

    this.props.showModal(MODAL_DELETE_CONFIRM, {
      title: transChoice('remove_workspaces', workspaces.length, {count: workspaces.length}, 'platform'),
      question: t('remove_workspaces_confirm', {
        workspace_list: workspaces.map(workspace => workspace.name).join(', ')
      }),
      handleConfirm: () => this.props.removeWorkspaces(workspaces)
    })
  }

  copyWorkspaces(workspaceIds, asModel = false) {
    const workspaces = this.getWorkspaces(workspaceIds)

    this.props.showModal(MODAL_CONFIRM, {
      title: t(asModel ? 'copy_model_workspace' : 'copy_workspace'),
      question: t(asModel ? 'copy_model_workspaces_confirm' : 'copy_workspaces_confirm', {
        workspace_list: workspaces.map(workspace => workspace.name).join(', ')
      }),
      handleConfirm: () => this.props.copyWorkspaces(workspaces, asModel)
    })
  }

  render() {
    return (
      <Page
        modal={this.props.modal}
        fadeModal={this.props.fadeModal}
        hideModal={this.props.hideModal}
      >
        <PageHeader
          title={t('workspaces_management')}
        >
          <PageActions>
            <PageAction
              id="workspace-add"
              title={t('create_workspace')}
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
              {name: 'is_model', type: 'boolean', label: t('model')},
              {name: 'isPersonal', type: 'boolean', label: t('personal_workspace'), flags: LIST_PROP_DEFAULT&~LIST_PROP_DISPLAYED},
              {name: 'displayable', type: 'boolean', label: t('displayable_in_workspace_list'), flags: LIST_PROP_DEFAULT&~LIST_PROP_DISPLAYED},
              {name: 'creationDate', type: 'date', label: t('creation_date')},
              {name: 'maxStorageSize', type: 'string', label: t('max_storage_size'), flags: LIST_PROP_DEFAULT&~LIST_PROP_DISPLAYED},
              {name: 'maxUploadResources', type: 'number', label: t('max_amount_resources'), flags: LIST_PROP_DEFAULT&~LIST_PROP_DISPLAYED},
              {name: 'maxUsers', type: 'number', label: t('workspace_max_users'), flags: LIST_PROP_DEFAULT&~LIST_PROP_DISPLAYED}
            ]}

            actions={[
              ...Configuration.getWorkspacesAdministrationActions().map(action => {
                return action.options.modal ? {
                  icon: action.icon,
                  label: action.name(),
                  action: (row) => action.url(row.id)
                } : {
                  icon: action.icon,
                  label: action.name(),
                  action: (row) => action.url(row.id)
                }
              }), {
                icon: 'fa fa-fw fa-copy',
                label: t('duplicate'),
                action: (row) => this.copyWorkspaces([row.id], false)
              }, {
                icon: 'fa fa-fw fa-clone',
                label: t('make_model'),
                action: (row) => this.copyWorkspaces([row.id], true)
              }, {
                icon: 'fa fa-fw fa-trash-o',
                label: t('delete'),
                action: (row) => this.removeWorkspaces([row.id]),
                isDangerous: true
              }
            ]}

            filters={{
              current: this.props.filters,
              addFilter: this.props.addListFilter,
              removeFilter: this.props.removeListFilter
            }}

            sorting={{
              current: this.props.sortBy,
              updateSort: this.props.updateSort
            }}

            pagination={Object.assign({}, this.props.pagination, {
              handlePageChange: this.props.handlePageChange,
              handlePageSizeUpdate: this.props.handlePageSizeUpdate
            })}

            selection={{
              current: this.props.selected,
              toggle: this.props.toggleSelect,
              toggleAll: this.props.toggleSelectAll,
              actions: [
                {label: t('duplicate'), icon: 'fa fa-fw fa-copy', action: () => this.copyWorkspaces(this.props.selected, false)},
                {label: t('make_model'), icon: 'fa fa-fw fa-clone', action: () => this.copyWorkspaces(this.props.selected, true)},
                {label: t('delete'), icon: 'fa fa-fw fa-trash-o', action: () => this.removeWorkspaces(this.props.selected), isDangerous: true}
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

  removeWorkspaces: T.func.isRequired,
  copyWorkspaces: T.func.isRequired,

  sortBy: T.object.isRequired,
  updateSort: T.func.isRequired,

  pagination: T.shape({
    pageSize: T.number.isRequired,
    current: T.number.isRequired
  }).isRequired,
  handlePageChange: T.func.isRequired,
  handlePageSizeUpdate: T.func.isRequired,

  filters: T.array.isRequired,
  addListFilter: T.func.isRequired,
  removeListFilter: T.func.isRequired,

  selected: T.array.isRequired,
  toggleSelect: T.func.isRequired,
  toggleSelectAll: T.func.isRequired,

  modal: T.shape({
    type: T.string,
    fading: T.bool.isRequired,
    props: T.object.isRequired
  }),
  createModal: T.func.isRequired,
  createModalFromUrl: T.func.isRequired,
  showModal: T.func.isRequired,
  fadeModal: T.func.isRequired,
  hideModal: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    data: select.data(state),
    totalResults: select.totalResults(state),
    selected: listSelect.selected(state),
    pagination: {
      pageSize: paginationSelect.pageSize(state),
      current:  paginationSelect.current(state)
    },
    filters: listSelect.filters(state),
    sortBy: listSelect.sortBy(state),
    modal: modalSelect.modal(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // workspaces
    removeWorkspaces: (workspaces) => {
      dispatch(actions.removeWorkspaces(workspaces))
    },
    copyWorkspaces: (workspaces, isModel) => {
      dispatch(actions.copyWorkspaces(workspaces, isModel))
    },

    // search
    addListFilter: (property, value) => {
      dispatch(listActions.addFilter(property, value))
      // grab updated workspace list
      dispatch(actions.fetchWorkspaces())
    },
    removeListFilter: (filter) => {
      dispatch(listActions.removeFilter(filter))
      // grab updated workspace list
      dispatch(actions.fetchWorkspaces())
    },

    // pagination
    handlePageSizeUpdate: (pageSize) => {
      dispatch(paginationActions.updatePageSize(pageSize))
      // grab updated workspace list
      dispatch(actions.fetchWorkspaces())
    },
    handlePageChange: (page) => {
      dispatch(paginationActions.changePage(page))
      // grab updated workspace list
      dispatch(actions.fetchWorkspaces())
    },

    // sorting
    updateSort: (property) => {
      dispatch(listActions.updateSort(property))
      // grab updated workspace list
      dispatch(actions.fetchWorkspaces())
    },

    // selection
    toggleSelect: (id) => dispatch(listActions.toggleSelect(id)),
    toggleSelectAll: (items) => dispatch(listActions.toggleSelectAll(items)),

    // modals
    createModal: (type, props, fading, hideModal) => makeModal(type, props, fading, hideModal, hideModal),
    createModalFromUrl: (fading, hideModal, url) => makeModalFromUrl(fading, hideModal, url),
    showModal(modalType, modalProps) {
      dispatch(modalActions.showModal(modalType, modalProps))
    },
    fadeModal() {
      dispatch(modalActions.fadeModal())
    },
    hideModal() {
      dispatch(modalActions.hideModal())
    }
  }
}

const ConnectedWorkspaces = connect(mapStateToProps, mapDispatchToProps)(Workspaces)

export {ConnectedWorkspaces as Workspaces}
