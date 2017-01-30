import { connect } from 'react-redux'

import {tex} from './../../utils/translate'
import QuestionList from './../components/question-list.jsx'
import {getVisibleQuestions} from './../selectors/questions'
import {actions as sortActions} from './../actions/sort-by'
import {actions as questionsActions} from './../actions/questions'
import {actions as selectActions} from './../actions/select'
import {showModal} from './../../modal/actions'
import {MODAL_DELETE_CONFIRM} from './../../modal'
import {select} from './../selectors'

const mapStateToProps = (state) => {
  return {
    questions: getVisibleQuestions(state),
    selected: select.selected(state),
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

    toggleSelectAll: () => {

    },

    toggleSelect: (item) => {
      dispatch(selectActions.toggleSelect(item.id));
    },

    onDelete: (item) => {
      dispatch(showModal(MODAL_DELETE_CONFIRM, {
        title: tex('delete_item'),
        question: tex('remove_question_confirm_message'),
        handleConfirm: () => dispatch(questionsActions.deleteQuestions([item.id]))
      }))
    }
  }
}

const VisibleQuestions = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionList)

export default VisibleQuestions
