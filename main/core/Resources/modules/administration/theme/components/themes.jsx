import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t, transChoice, ClarolineTranslator} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'
import {MODAL_CONFIRM, MODAL_DELETE_CONFIRM, MODAL_URL, MODAL_USER_PICKER} from '#/main/core/layout/modal'

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

import {LIST_PROP_DEFAULT, LIST_PROP_DISPLAYED, LIST_PROP_DISPLAYABLE, LIST_PROP_FILTERABLE} from '#/main/core/layout/list/utils'
import {DataList} from '#/main/core/layout/list/components/data-list.jsx'

class Themes extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Page
        id="theme-management"
        modal={this.props.modal}
        fadeModal={this.props.fadeModal}
        hideModal={this.props.hideModal}
      >
        <PageHeader
          title={t('theme_management')}
        >
          <PageActions>
            <PageAction
              id="theme-add"
              title={t('create_theme')}
              icon="fa fa-plus"
              primary={true}
              action="#"
            />

            <PageAction
              id="theme-import"
              title={t('import_theme')}
              icon="fa fa-download"
              action="#"
            />
          </PageActions>
        </PageHeader>

        <PageContent>
          <DataList
            data={this.props.themes}
            totalResults={this.props.themes.length}

            definition={[
              {
                name: 'name',
                type: 'string',
                label: t('name')
              }
            ]}

            actions={[
              {
                icon: 'fa fa-fw fa-pencil',
                label: t('edit_theme'),
                action: (row) => true
              }, {
                icon: 'fa fa-fw fa-trash-o',
                label: t('delete'),
                action: (row) => this.removeWorkspaces([row.id]),
                isDangerous: true
              },
              {
                icon: 'fa fa-fw fa-upload',
                label: t('export'),
                action: (row) => true,
              }
            ]}

            sorting={{
              current: this.props.sortBy,
              updateSort: this.props.updateSort
            }}

            selection={{
              current: this.props.selected,
              toggle: this.props.toggleSelect,
              toggleAll: this.props.toggleSelectAll,
              actions: [
                {label: t('delete'), icon: 'fa fa-fw fa-trash-o', action: () => true, isDangerous: true}
              ]
            }}
          />
        </PageContent>
      </Page>
    )
  }
}

Themes.propTypes = {
  themes: T.arrayOf(T.object),

  removeWorkspaces: T.func.isRequired,
  copyWorkspaces: T.func.isRequired,

  sortBy: T.object.isRequired,
  updateSort: T.func.isRequired,

  selected: T.array.isRequired,
  toggleSelect: T.func.isRequired,
  toggleSelectAll: T.func.isRequired,

  modal: T.shape({
    type: T.string,
    fading: T.bool.isRequired,
    props: T.object.isRequired
  }),
  showModal: T.func.isRequired,
  fadeModal: T.func.isRequired,
  hideModal: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    themes: select.themes(state),
    selected: listSelect.selected(state),
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
    addManager: (workspace, user) => {
      dispatch(actions.addManager(workspace, user))
    },
    removeManager: (workspace, user) => {
      dispatch(actions.removeManager(workspace, user))
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

const ConnectedThemes = connect(mapStateToProps, mapDispatchToProps)(Themes)

export {ConnectedThemes as Themes}
