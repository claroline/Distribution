import { connect } from 'react-redux'

import {tex} from './../../utils/translate'
import QuestionList from './../components/question-list.jsx'
import {getVisibleQuestions} from './../selectors/questions'
import {actions as sortActions} from './../actions/sort-by'
import {showModal} from './../../modal/actions'
import {MODAL_DELETE_CONFIRM} from './../../modal'

const mapStateToProps = (state) => {
  return {
    questions: getVisibleQuestions(state),
    sortBy: state.sortBy
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    /**
     * Update sort order.
     *
     * @param property
     */
    onSort: (property) => {
      dispatch(sortActions.updateSortBy(property))
    },

    /**
     * Select all items.
     */
    onSelectAll: () => {

    },

    onDelete: (item) => {
        dispatch(showModal(MODAL_DELETE_CONFIRM, {
          title: tex('delete_item'),
          question: tex('remove_question_confirm_message'),
          handleConfirm: () => true
        }))
    }
  }
}

const VisibleQuestions = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionList)

export default VisibleQuestions
