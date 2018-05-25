import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as listSelect} from '#/main/core/data/list/selectors'

import {actions} from '#/plugin/forum/resources/forum/player/actions'

const MessagesSortButton = props =>
  <div className="messages-sort">
    {trans('list_sort_by')}
    <button
      type="button"
      className="btn btn-link"
      disabled={0 === props.messages.length}
      onClick={props.toggleSort}
    >
      {trans(1 === props.sortOrder ? 'from_older_to_newer':'from_newer_to_older', {}, 'forum')}
    </button>
  </div>

MessagesSortButton.propTypes = {
  sortOrder: T.number,
  toggleSort: T.func.isRequired
}

const MessagesSort = connect(
  state => ({
    messages: listSelect.data(listSelect.list(state, 'subjects.messages'))
  }),
  dispatch => ({
    toggleSort() {
      dispatch(actions.toggleMessagesSort())
    }
  })
)(MessagesSortButton)

export {
  MessagesSort
}
