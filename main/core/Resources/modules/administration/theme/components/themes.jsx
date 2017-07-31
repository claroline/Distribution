import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {NavLink, withRouter} from 'react-router-dom'

import {t, trans, transChoice} from '#/main/core/translation'
import {MODAL_CONFIRM, MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'

import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {actions as listActions} from '#/main/core/layout/list/actions'
import {actions} from '#/main/core/administration/theme/actions'

import {select as listSelect} from '#/main/core/layout/list/selectors'
import {select} from '#/main/core/administration/theme/selectors'

import {
  PageContainer as Page,
  PageHeader,
  PageContent,
  PageActions,
  PageAction,
} from '#/main/core/layout/page/index'

import {DataList} from '#/main/core/layout/list/components/data-list.jsx'

class Themes extends Component {
  getThemes(themeIds) {
    return themeIds.map(themeId => this.props.themes.find(theme => themeId === theme.id))
  }

  getTheme(themeId) {
    return this.props.themes.find(theme => themeId === theme.id)
  }

  rebuildThemes(themeIds) {
    const themes = this.getThemes(themeIds)

    this.props.showModal(MODAL_CONFIRM, {
      title: transChoice('rebuild_themes', themes.length, {count: themes.length}, 'theme'),
      question: trans('rebuild_themes_confirm', {
        workspace_list: themes.map(theme => theme.name).join(', ')
      }, 'theme'),
      handleConfirm: () => this.props.rebuildThemes(themes)
    })
  }

  removeThemes(themeIds) {
    const themes = this.getThemes(themeIds)

    this.props.showModal(MODAL_DELETE_CONFIRM, {
      title: transChoice('remove_themes', themes.length, {count: themes.length}, 'theme'),
      question: trans('remove_themes_confirm', {
        workspace_list: themes.map(theme => theme.name).join(', ')
      }, 'theme'),
      handleConfirm: () => this.props.removeThemes(themes)
    })
  }

  render() {
    return (
      <Page id="theme-management">
        <PageHeader
          title={t('themes_management')}
        >
          <PageActions>
            <PageAction
              id="theme-add"
              title={trans('create_theme', {}, 'theme')}
              icon="fa fa-plus"
              primary={true}
              action={this.props.createTheme}
            />

            <PageAction
              id="theme-import"
              title={trans('import_theme', {}, 'theme')}
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
                label: trans('theme_name', {}, 'theme'),
                renderer: (rowData) => <NavLink to={`/${rowData.id}`}>{rowData.name}</NavLink>
              },
              {name: 'meta.description', type: 'string', label: trans('theme_description', {}, 'theme')},
              {name: 'meta.plugin',      type: 'string', label: trans('theme_plugin', {}, 'theme')},
              {name: 'meta.enabled',     type: 'flag',   label: trans('theme_enabled', {}, 'theme')},
              {name: 'current',          type: 'flag',   label: trans('theme_current', {}, 'theme')},
            ]}

            actions={[
              {
                icon: 'fa fa-fw fa-refresh',
                label: trans('rebuild_theme', {}, 'theme'),
                action: (row) => this.rebuildThemes([row.id])
              },
              {
                icon: 'fa fa-fw fa-copy',
                label: trans('copy_theme', {}, 'theme'),
                action: (row) => this.props.copyTheme(this.getTheme(row.id))
              },
              {
                icon: 'fa fa-fw fa-upload',
                label: trans('export_theme', {}, 'theme'),
                action: (row) => true,
              }, {
                icon: 'fa fa-fw fa-trash-o',
                label:trans('remove_theme', {}, 'theme'),
                action: (row) => this.removeThemes([row.id]),
                isDangerous: true
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
                {label: t('rebuild_themes'), icon: 'fa fa-fw fa-refresh', action: () => this.rebuildThemes(this.props.selected)},
                {label: t('delete'), icon: 'fa fa-fw fa-trash-o', action: () => this.removeThemes(this.props.selected), isDangerous: true}
              ]
            }}
          />
        </PageContent>
      </Page>
    )
  }
}

Themes.propTypes = {
  // themes
  themes: T.arrayOf(T.object),

  createTheme: T.func.isRequired,
  copyTheme: T.func.isRequired,
  removeThemes: T.func.isRequired,
  rebuildThemes: T.func.isRequired,

  // list
  sortBy: T.object.isRequired,
  updateSort: T.func.isRequired,
  selected: T.array.isRequired,
  toggleSelect: T.func.isRequired,
  toggleSelectAll: T.func.isRequired,

  // modals
  showModal: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    themes: select.themes(state),
    selected: listSelect.selected(state),
    sortBy: listSelect.sortBy(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createTheme: () => {
      dispatch(actions.createTheme())
    },

    copyTheme: () => {
      dispatch(actions.copyTheme())
    },

    rebuildThemes: (themes) => {
      dispatch(actions.rebuildThemes(themes))
    },

    removeThemes: (themes) => {
      dispatch(actions.removeThemes(themes))
    },

    // sorting
    updateSort: (property) => {
      dispatch(listActions.updateSort(property))
    },

    // selection
    toggleSelect: (id) => dispatch(listActions.toggleSelect(id)),
    toggleSelectAll: (items) => dispatch(listActions.toggleSelectAll(items)),

    // modals
    showModal(modalType, modalProps) {
      dispatch(modalActions.showModal(modalType, modalProps))
    }
  }
}

const ConnectedThemes = withRouter(connect(mapStateToProps, mapDispatchToProps)(Themes))

export {ConnectedThemes as Themes}
