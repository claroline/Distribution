import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'

import {generateId} from '#/plugin/drop-zone/resources/dropzone/utils'
import {select} from '#/plugin/drop-zone/resources/dropzone/selectors'
import {actions} from '#/plugin/drop-zone/resources/dropzone/correction/actions'
import {CorrectionForm} from '#/plugin/drop-zone/resources/dropzone/correction/components/correction-form.jsx'

class CorrectionCreation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showCorrectionForm: false
    }
    this.updateCorrection = this.updateCorrection.bind(this)
    this.updateCorrectionCriterion = this.updateCorrectionCriterion.bind(this)
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

  updateCorrectionCriterion(criterionId, value) {
    this.props.updateCorrectionCriterion(criterionId, value)
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
        dropzone={this.props.dropzone}
        handleUpdate={this.updateCorrection}
        handleCriterionUpdate={this.updateCorrectionCriterion}
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
  dropzone: T.object,
  drop: T.shape({
    id: T.string
  }),
  correction: T.object,
  loadNewCorrection: T.func.isRequired,
  resetCorrection: T.func.isRequired,
  updateCorrection: T.func.isRequired,
  updateCorrectionCriterion: T.func.isRequired,
  saveCorrection: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    correction: select.correctionForm(state),
    dropzone: select.dropzone(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadNewCorrection: (id, dropId) => dispatch(actions.loadNewCorrection(id, dropId)),
    resetCorrection: () => dispatch(actions.resetCorrectionForm()),
    updateCorrection: (property, value) => dispatch(actions.updateCorrectionForm(property, value)),
    updateCorrectionCriterion: (criterionId, value) => dispatch(actions.updateCorrectionFormCriterion(criterionId, value)),
    saveCorrection: (correction) => dispatch(actions.saveCorrection(correction))
  }
}

const ConnectedCorrectionCreation = connect(mapStateToProps, mapDispatchToProps)(CorrectionCreation)

export {ConnectedCorrectionCreation as CorrectionCreation}