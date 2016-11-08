import { connect } from 'react-redux'

/*import QuestionList from './../components/question-list.jsx';*/
import {actions as modalActions} from './../actions'

const mapStateToProps = (state) => {
  return {
    modal: state.modal
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fadeModal() {
      dispatch(modalActions.fadeModal())
    },
    hideModal() {
      dispatch(modalActions.hideModal())
    },
    showModal(type, props) {
      dispatch(modalActions.showModal(type, props))
    }
  }
}

/*
const Modal = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionList)

export default Modal*/
