import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'

import {generateId} from '../../utils'
import {select} from '../../selectors'
import {actions} from '../actions'

import {CorrectionForm} from './correction-form.jsx'

class CorrectionCreation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showCorrectionForm: false
    }
    this.updateCorrection = this.updateCorrection.bind(this)
    this.saveCorrection = this.saveCorrection.bind(this)
    this.cancelCorrection = this.cancelCorrection.bind(this)
  }

  showCorrectionCreationForm() {
    const id = generateId()
    this.props.loadNewCorrection(id, this.props.drop.id)
    this.setState({showCorrectionForm: true})
  }

  updateCorrection(property, value) {
    this.props.updateCorrection(property, value)
  }

  saveCorrection() {
    this.props.saveCorrection(this.props.correction)
    this.setState({showCorrectionForm: false})
    this.props.resetCorrection()
  }

  cancelCorrection() {
    this.setState({showCorrectionForm: false})
    this.props.resetCorrection()
  }

  render() {
    return (this.state.showCorrectionForm ?
      <CorrectionForm
        correction={this.props.correction}
        handleUpdate={this.updateCorrection}
        handleSave={this.saveCorrection}
        handleCancel={this.cancelCorrection}
      /> :
      <button
        className="btn btn-default"
        onClick={() => this.showCorrectionCreationForm()}
      >
        {trans('add_correction', {}, 'dropzone')}
      </button>
    )
  }
}

CorrectionCreation.propTypes = {
  drop: T.shape({
    id: T.string
  }),
  correction: T.shape({
    id: T.string,
    drop: T.string,
    totalGrade: T.number,
    comment: T.string
  }),
  loadNewCorrection: T.func.isRequired,
  resetCorrection: T.func.isRequired,
  updateCorrection: T.func.isRequired,
  saveCorrection: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    correction: select.correctionForm(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadNewCorrection: (id, dropId) => dispatch(actions.loadNewCorrection(id, dropId)),
    resetCorrection: () => dispatch(actions.resetCorrectionForm()),
    updateCorrection: (property, value) => dispatch(actions.updateCorrectionForm(property, value)),
    saveCorrection: (correction) => dispatch(actions.saveCorrection(correction))
  }
}

const ConnectedCorrectionCreation = connect(mapStateToProps, mapDispatchToProps)(CorrectionCreation)

export {ConnectedCorrectionCreation as CorrectionCreation}