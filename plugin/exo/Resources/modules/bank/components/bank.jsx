import React, { Component } from 'react'
import { connect } from 'react-redux'

import { actions as paginationActions } from './../actions/pagination'
import { countPages } from './../selectors/pagination'
import VisibleQuestions from './../containers/visible-questions.jsx'
import Pagination from './pagination/pagination.jsx'
import PageHeader from './../../components/layout/page-header.jsx'
import PageActions from './../../components/layout/page-actions.jsx'

import { tex } from './../../utils/translate'
import { MODAL_ADD_ITEM } from './../../quiz/editor/components/modals.jsx'

// TODO : do not load from editor
import { actions as editorActions } from './../../quiz/editor/actions'

const T = React.PropTypes

class Bank extends Component {
  render() {
    const actions = [
      {
        icon: 'fa fa-fw fa-plus',
        label: tex('add_question'),
        handleAction: () => this.props.showModal(MODAL_ADD_ITEM, {
          title: tex('add_question'),
          handleSelect: type => {
            this.props.closeModal()
            this.props.handleItemCreate(type)
          }
        }),
        primary: true
      },
      {
        icon: 'fa fa-fw fa-search',
        label: tex('search'),
        handleAction: () => this.props.showModal('searchModal', {
          title: tex('search'),
          handleSearch: () => {
            this.props.closeModal()
            this.props.handleSearch()
          }
        }),
        primary: true
      },
      {
        icon: 'fa fa-fw fa-download',
        label: 'Import QTI questions',
        handleAction: () => true,
        primary: false
      },
      {
        icon: 'fa fa-fw fa-file',
        label: 'Manage medias',
        handleAction: () => true,
        primary: false
      }
    ]

    return (
      <div>
        <PageHeader title="Banque de questions">
          <PageActions actions={actions} />
        </PageHeader>

        <VisibleQuestions />

        <Pagination
          current={this.props.pagination.current}
          pageSize={this.props.pagination.pageSize}
          pages={this.props.pages}
          handlePageChange={this.props.handlePageChange}
          handlePagePrevious={this.props.handlePagePrevious}
          handlePageNext={this.props.handlePageNext}
          handlePageSizeUpdate={this.props.handlePageSizeUpdate}
        />
      </div>
    )
  }
}

Bank.propTypes = {
  showModal: T.func.isRequired,
  closeModal: T.func.isRequired,
  handleItemCreate: T.func.isRequired,
  handleSearch: T.func.isRequired,
  handlePageChange: T.func.isRequired,
  handlePagePrevious: T.func.isRequired,
  handlePageNext: T.func.isRequired,
  handlePageSizeUpdate: T.func.isRequired,
  pages: T.number.isRequired,
  pagination: T.shape({
    current: T.number.isRequired,
    pageSize: T.number.isRequired
  })
}

function mapStateToProps(state) {
  return {
    pagination: state.pagination,
    pages: countPages(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fadeModal() {
      dispatch(editorActions.fadeModal())
    },
    hideModal() {
      dispatch(editorActions.hideModal())
    },
    showModal(type, props) {
      dispatch(editorActions.showModal(type, props))
    },
    handleItemCreate() {

    },
    handleSearch() {

    },
    handlePagePrevious() {
      dispatch(paginationActions.previousPage())
    },
    handlePageNext() {
      dispatch(paginationActions.nextPage())
    },
    handlePageChange(page) {
      dispatch(paginationActions.changePage(page))
    },
    handlePageSizeUpdate(pageSize) {
      dispatch(paginationActions.updatePageSize(pageSize))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bank)
