import { connect } from 'react-redux'

import QuestionList from './../components/question-list.jsx'
import {getVisibleQuestions} from './../selectors/questions'
import {actions as sortActions} from './../actions/sort-by'

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

    }
  }
}

const VisibleQuestions = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionList)

export default VisibleQuestions
