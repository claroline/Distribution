import React, { Component } from 'react'
import { connect } from 'react-redux'
import {DropdownButton, MenuItem} from 'react-bootstrap'

import {actions as paginationActions} from './../actions/pagination'
import {countPages} from './../selectors/pagination'
import VisibleQuestions from './../containers/visible-questions.jsx'
import Pagination from './pagination/pagination.jsx'

import {tex} from './../../utils/translate'
import {MODAL_ADD_ITEM} from './../../editor/components/modals.jsx'
import {actions as editorActions} from './../../editor/actions'

const T = React.PropTypes

const AddQuestionButton = props =>
  <button
    type="button"
    className="btn btn-link"
    onClick={() => props.showModal(MODAL_ADD_ITEM, {
        title: tex('add_question'),
        handleSelect: type => {
          props.closeModal()
          props.handleItemCreate(type)
        }
      })
    }
  >
    <span className="fa fa-plus"></span>
    &nbsp;{tex('add_question')}
  </button>

AddQuestionButton.propTypes = {
  showModal: T.func.isRequired,
  closeModal: T.func.isRequired,
  handleItemCreate: T.func.isRequired
}

const SearchButton = props =>
  <button
    type="button"
    className="btn btn-link"
    onClick={() => props.showModal(MODAL_SEARCH, {
        title: tex('search'),
        handleSearch: () => {
          props.closeModal()
          props.handleSearch()
        }
      })
    }
  >
    <span className="fa fa-fw fa-search"></span>
    &nbsp;{tex('search')}
  </button>

SearchButton.propTypes = {
  showModal: T.func.isRequired,
  closeModal: T.func.isRequired,
  handleSearch: T.func.isRequired
}

class Bank extends Component {
  render() {
    return (
      <div>
        <div className="snap">
          <h1 className="page-header">Banque de questions</h1>

          <div className="actions">
            <AddQuestionButton
              showModal={this.props.showModal}
              closeModal={this.props.hideModal}
              handleItemCreate={this.props.handleItemCreate}
            />

            <SearchButton
              showModal={this.props.showModal}
              closeModal={this.props.hideModal}
              handleSearch={this.props.handleSearch}
            />

            <DropdownButton
              id={`dropdown-other-actions`}
              title={<span className="fa fa-fw fa-ellipsis-v"></span>}
              bsStyle={`link`}
              noCaret={true}
              pullRight={true}
            >
              <MenuItem header>More actions</MenuItem>
              <MenuItem eventKey="1">
                <span className="fa fa-fw fa-download"></span>
                Import QTI questions
              </MenuItem>
              <MenuItem eventKey="2">
                <span className="fa fa-fw fa-file"></span>
                Manage medias
              </MenuItem>
            </DropdownButton>
          </div>
        </div>

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

function mapStateToProps(state) {
  return {
    pagination: state.pagination,
    pages: countPages(state),

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
    handleItemCreate(type) {

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
