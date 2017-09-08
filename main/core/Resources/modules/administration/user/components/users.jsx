import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {actions as paginationActions} from '#/main/core/layout/pagination/actions'
import {actions as listActions} from '#/main/core/layout/list/actions'
import {actions} from '#/main/core/administration/user/actions'

import {select as paginationSelect} from '#/main/core/layout/pagination/selectors'
import {select as listSelect} from '#/main/core/layout/list/selectors'
import {select} from '#/main/core/administration/user/selectors'

import {
  PageContainer as Page,
  PageHeader,
  PageContent,
  PageActions,
  PageAction
} from '#/main/core/layout/page/index'

import {LIST_PROP_DISPLAYED, LIST_PROP_FILTERABLE} from '#/main/core/layout/list/utils'
import {DataList} from '#/main/core/layout/list/components/data-list.jsx'

class Users extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Page id="user-management">
        <PageHeader
          title={t('workspaces_management')}
        >
          <PageActions>
            <PageAction
              id="user-add"
              title={t('create_user')}
              icon="fa fa-plus"
              primary={true}
              action='#'
            />

            <PageAction
              id="user-import"
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
              {
                name: 'name',
                type: 'string',
                label: t('name'),
                renderer: (rowData) => <a href='#'> {rowData.lastName} {rowData.firstName}</a>,
                flags: ~LIST_PROP_FILTERABLE
              },
              {name: 'username', type: 'string', label: t('username'), flags: LIST_PROP_FILTERABLE&LIST_PROP_DISPLAYED},
              {name: 'firstName', type: 'string', label: t('first_name'), flags: LIST_PROP_FILTERABLE&~LIST_PROP_DISPLAYED},
              {name: 'lastName', type: 'string', label: t('last_name'), flags: LIST_PROP_FILTERABLE&~LIST_PROP_DISPLAYED}
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
          />
        </PageContent>
      </Page>
    )
  }
}

Users.propTypes = {
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
    // search
    addListFilter: (property, value) => {
      dispatch(listActions.addFilter(property, value))
      // grab updated user list
      dispatch(actions.fetchUsers())
    },
    removeListFilter: (filter) => {
      dispatch(listActions.removeFilter(filter))
      // grab updated user list
      dispatch(actions.fetchUsers())
    },

    // pagination
    handlePageSizeUpdate: (pageSize) => {
      dispatch(paginationActions.updatePageSize(pageSize))
      // grab updated user list
      dispatch(actions.fetchUsers())
    },
    handlePageChange: (page) => {
      dispatch(paginationActions.changePage(page))
      // grab updated user list
      dispatch(actions.fetchUsers())
    },

    // sorting
    updateSort: (property) => {
      dispatch(listActions.updateSort(property))
      // grab updated user list
      dispatch(actions.fechtUsers())
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

const ConnectedUsers = connect(mapStateToProps, mapDispatchToProps)(Users)

export {ConnectedUsers as Users}
