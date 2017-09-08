import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {actions as paginationActions} from '#/main/core/layout/pagination/actions'
import {actions as listActions} from '#/main/core/layout/list/actions'
import {actions} from '#/main/core/administration/user-management/group/actions'

import {select as paginationSelect} from '#/main/core/layout/pagination/selectors'
import {select as listSelect} from '#/main/core/layout/list/selectors'
import {select} from '#/main/core/administration/user-management/group/selectors'

import {
  PageContainer as Page,
  PageHeader,
  PageContent,
  PageActions,
  PageAction
} from '#/main/core/layout/page/index'

import {LIST_PROP_DISPLAYED, LIST_PROP_FILTERABLE} from '#/main/core/layout/list/utils'
import {DataList} from '#/main/core/layout/list/components/data-list.jsx'

class Groups extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Page id="group-management">
        <PageHeader
          title={t('group_management')}
        >
          <PageActions>
            <PageAction
              id="group-add"
              title={t('group_add')}
              icon="fa fa-plus"
              primary={true}
              action='#'
            />

            <PageAction
              id="group-import"
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
              {name: 'name', type: 'string', label: t('name'), flags: LIST_PROP_FILTERABLE&~LIST_PROP_DISPLAYED}
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

Groups.propTypes = {
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
      dispatch(actions.fetchGroups())
    },
    removeListFilter: (filter) => {
      dispatch(listActions.removeFilter(filter))
      // grab updated user list
      dispatch(actions.fetchGroups())
    },

    // pagination
    handlePageSizeUpdate: (pageSize) => {
      dispatch(paginationActions.updatePageSize(pageSize))
      // grab updated user list
      dispatch(actions.fetchGroups())
    },
    handlePageChange: (page) => {
      dispatch(paginationActions.changePage(page))
      // grab updated user list
      dispatch(actions.fetchGroups())
    },

    // sorting
    updateSort: (property) => {
      dispatch(listActions.updateSort(property))
      // grab updated user list
      dispatch(actions.fetchGroups())
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

const ConnectedGroups = connect(mapStateToProps, mapDispatchToProps)(Groups)

export {ConnectedGroups as Groups}
