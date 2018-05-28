import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as listSelect} from '#/main/core/data/list/selectors'

import {actions} from '#/plugin/forum/resources/forum/player/actions'
import {select} from '#/plugin/forum/resources/forum/selectors'

const MessagesSortButton = props =>
  <div>
    <div className="messages-sort">
      {trans('list_sort_by')}
      <button
        type="button"
        className="btn btn-link"
        disabled={0 === props.totalResults}
        onClick={props.toggleSort}
      >
        {trans(1 === props.sortOrder ? 'from_older_to_newer':'from_newer_to_older', {}, 'forum')}
      </button>
    </div>
    {props.children}
    {1 < props.pages &&
      <nav className="text-right">
        <div className="pagination-condensed btn-group">
          <button
            type="button"
            className="btn btn-pagination btn-previous"
            disabled={0 === props.currentPage}
            onClick={() => props.changePage(props.currentPage - 1)}
          >
            <span className="fa fa-angle-double-left" aria-hidden="true" />
            <span className="sr-only">
              {trans(1 === props.sortOrder ? 'older':'newer', {}, 'forum')}
            </span>
          </button>

          <button
            type="button"
            className="btn btn-pagination btn-next"
            disabled={(props.pages - 1) === props.currentPage}
            onClick={() => props.changePage(props.currentPage + 1)}
          >
            {trans(1 === props.sortOrder ? 'newer':'older', {}, 'forum')}
            <span className="fa fa-angle-double-right" aria-hidden="true" />
          </button>
        </div>
      </nav>
    }
  </div>

MessagesSortButton.propTypes = {
  sortOrder: T.number.isRequired,
  children: T.node.isRequired,
  currentPage: T.number.isRequired,
  pages: T.number.isRequired,
  changePage: T.func.isRequired,
  toggleSort: T.func.isRequired,
  messages: T.arrayOf(T.shape({})),
  totalResults: T.number.isRequired
}

const MessagesSort = connect(
  state => ({
    messages: listSelect.data(listSelect.list(state, 'subjects.messages')),
    totalResults: select.totalResults(state),
    sortOrder: select.sortOrder(state),
    currentPage: select.currentPage(state),
    pages: select.pages(state)
  }),
  dispatch => ({
    toggleSort() {
      dispatch(actions.toggleMessagesSort())
    },
    changePage(page) {
      dispatch(actions.changeMessagesPage(page))
    }
  })
)(MessagesSortButton)

export {
  MessagesSort
}
