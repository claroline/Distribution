import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {actions as paginationActions} from '#/main/core/layout/pagination/actions'
import {actions as listActions} from '#/main/core/layout/list/actions'
import {actions} from '#/main/core/administration/user-management/role/actions'

import {select as paginationSelect} from '#/main/core/layout/pagination/selectors'
import {select as listSelect} from '#/main/core/layout/list/selectors'
import {select} from '#/main/core/administration/user-management/role/selectors'

import {enumRole} from '#/main/core/enum/role'
import {MODAL_CONFIRM, MODAL_FORM} from '#/main/core/layout/modal'

import {
  PageContainer as Page,
  PageHeader,
  PageContent,
  PageActions,
  PageAction
} from '#/main/core/layout/page/index'

import {DataList} from '#/main/core/layout/list/components/data-list.jsx'

class Roles extends Component {
  constructor(props) {
    super(props)
  }

  renderModal(item = {}, onChange = {}) {
    this.props.showModal(MODAL_FORM, {
      title: 'create',
      definition: [
        ['translation', 'text', {label: 'name'}],
        ['limit', 'number', {label: 'limit'}],
//        ['hasWorkspace', 'checkbox', {label: 'has_workspace'}],
//        ['organizations', 'checkboxes', {options: [['hey', 1],['how are you', 2]]}]
      ],
      item,
      onSubmit: (role) => {
        console.log(role)
        this.props.editRole(role)
      }
    })
  }

  render() {
    return (
      <Page id="role-management">
        <PageHeader
          title={t('role_management')}
        >
          <PageActions>
            <PageAction
              id="role-add"
              title={t('role_add')}
              icon="fa fa-plus"
              primary={true}
              action={() => this.renderModal()}
            />

            <PageAction
              id="role-import"
              title={t('import_csv')}
              icon="fa fa-download"
              action='#'
            />
          </PageActions>
        </PageHeader>

        <PageContent>
          <DataList
            data={this.props.data}
            totalResults={this.props.totalResults}
            definition={[
              {name: 'name', type: 'string', label: t('name')},
              {name: 'type', type: 'enum', label: t('type'), options: {enum: enumRole}},
              {name: 'translation', type: 'string', label: t('translation')}
            ]}

            pagination={Object.assign({}, this.props.pagination, {
              handlePageChange: this.props.handlePageChange,
              handlePageSizeUpdate: this.props.handlePageSizeUpdate
            })}

            filters={{
              current: this.props.filters,
              addFilter: this.props.addListFilter,
              removeFilter: this.props.removeListFilter
            }}

            sorting={{
              current: this.props.sortBy,
              updateSort: this.props.updateSort
            }}

            actions={[
              {
                icon: 'fa fa-fw fa-pencil',
                label: t('edit'),
                action: (row) => {
                  this.renderModal(row)
                }
              }
            ]}
          />
        </PageContent>
      </Page>
    )
  }
}

Roles.propTypes = {
  data: T.arrayOf(T.object),
  totalResults: T.number.isRequired,
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
  showModal: T.func.isRequired
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
    sortBy: listSelect.sortBy(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    //modal
    editRole: (id, property, value) => {
      dispatch(actions.editRole(id, property, value))
    },
    // search
    addListFilter: (property, value) => {
      dispatch(listActions.addFilter(property, value))
      // grab updated user list
      dispatch(actions.fetchRoles())
    },
    removeListFilter: (filter) => {
      dispatch(listActions.removeFilter(filter))
      // grab updated user list
      dispatch(actions.fetchRoles())
    },

    // pagination
    handlePageSizeUpdate: (pageSize) => {
      dispatch(paginationActions.updatePageSize(pageSize))
      // grab updated user list
      dispatch(actions.fetchRoles())
    },
    handlePageChange: (page) => {
      dispatch(paginationActions.changePage(page))
      // grab updated user list
      dispatch(actions.fetchRoles())
    },

    // sorting
    updateSort: (property) => {
      dispatch(listActions.updateSort(property))
      // grab updated user list
      dispatch(actions.fetchRoles())
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

const ConnectedRoles = connect(mapStateToProps, mapDispatchToProps)(Roles)

export {ConnectedRoles as Roles}
