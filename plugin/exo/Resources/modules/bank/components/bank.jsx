import React, {PropTypes as T} from 'react'
import {connect} from 'react-redux'
import classes from 'classnames'

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'

import {tex, transChoice} from '#/main/core/translation'
import {makeModal} from '#/main/core/layout/modal'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {select} from './../selectors'
import {actions as paginationActions} from './../actions/pagination'
import {actions as searchActions} from './../actions/search'
import {select as paginationSelect} from './../selectors/pagination'

import { Page, PageHeader, PageContent} from '#/main/core/layout/page/components/page.jsx'
import { PageActions, PageAction } from '#/main/core/layout/page/components/page-actions.jsx'
import { DataList } from '#/main/core/layout/list/components/data-list.jsx'

import VisibleQuestions from './../containers/visible-questions.jsx'

import {MODAL_SEARCH} from './modal/search.jsx'
// TODO : do not load from editor
import {MODAL_ADD_ITEM} from './../../quiz/editor/components/add-item-modal.jsx'

const Bank = (props) => {
  const actions = [
    {
      icon: 'fa fa-fw fa-search',
      label: tex('search'),
      handleAction: () => props.openSearchModal(props.searchFilters),
      badge: (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="activeFiltersCount">{transChoice('active_filters', props.activeFilters, {count: props.activeFilters}, 'ujm_exo')}</Tooltip>}
      >
        <small className={classes('label', 0 < props.activeFilters ? 'label-primary' : 'label-default')}>{props.activeFilters}</small>
      </OverlayTrigger>
      ),
      primary: true
    }
  ]

  return (
    <Page>
      <PageHeader
        title={tex('questions_bank')}
      >
        <PageActions>
          <PageAction id="question-add" title="Add a question" icon="fa fa-plus" primary={true} />
          <PageAction id="question-import" title="Import a question" icon="fa fa-download" />
        </PageActions>
      </PageHeader>

      {props.modal.type &&
        props.createModal(
          props.modal.type,
          props.modal.props,
          props.modal.fading
        )
      }

     <PageContent>
       <DataList
         totalResults={props.totalResults}
         filters={{
           available: props.searchFilters,
           active: [
             {
               property: 'question',
               value: 'This is a search'
             },
             {
               property: 'type',
               value: 'Association'
             },
             {
               property: 'category',
               value: 'Guitar'
             },
             {
               property: 'author',
               value: 'Axel Penin'
             }
           ]
         }}
         pagination={{
           current: props.pagination.current,
           pageSize: props.pagination.pageSize,
           pages: props.pages,
           handlePageChange: props.handlePageChange,
           handlePagePrevious: props.handlePagePrevious,
           handlePageNext: props.handlePageNext,
           handlePageSizeUpdate: props.handlePageSizeUpdate
         }}
         columns={{
           available: ['type', 'question', 'category', 'authors'],
           active: ['type', 'question']
         }}
       >
         <VisibleQuestions />
       </DataList>
     </PageContent>
    </Page>
  )
}

Bank.propTypes = {
  totalResults: T.number.isRequired,
  searchFilters: T.object.isRequired,
  activeFilters: T.number.isRequired,
  modal: T.shape({
    type: T.string,
    fading: T.bool.isRequired,
    props: T.object.isRequired
  }),
  pages: T.number.isRequired,
  pagination: T.shape({
    current: T.number.isRequired,
    pageSize: T.number.isRequired
  }),
  createModal: T.func.isRequired,
  openSearchModal: T.func.isRequired,
  openAddModal: T.func.isRequired,
  handlePageChange: T.func.isRequired,
  handlePagePrevious: T.func.isRequired,
  handlePageNext: T.func.isRequired,
  handlePageSizeUpdate: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    searchFilters: select.filters(state),
    activeFilters: select.countFilters(state),
    modal: select.modal(state),
    totalResults: paginationSelect.getTotalResults(state),
    pagination: paginationSelect.getPagination(state),
    pages: paginationSelect.countPages(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createModal: (type, props, fading) => makeModal(type, props, fading, dispatch),
    openSearchModal(searchFilters) {
      dispatch(modalActions.showModal(MODAL_SEARCH, {
        title: tex('search'),
        filters: searchFilters,
        handleSearch: (searchFilters) => dispatch(searchActions.search(searchFilters)),
        clearFilters: () => dispatch(searchActions.clearFilters())
      }))
    },
    openAddModal() {
      dispatch(modalActions.showModal(MODAL_ADD_ITEM, {
        title: tex('add_question_from_new'),
        handleSelect: () => dispatch(modalActions.fadeModal())
      }))
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

const ConnectedBank = connect(mapStateToProps, mapDispatchToProps)(Bank)

export {ConnectedBank as Bank}
