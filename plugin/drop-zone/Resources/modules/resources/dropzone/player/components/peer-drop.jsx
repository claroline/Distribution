import React, {Component} from 'react'
import cloneDeep from 'lodash/cloneDeep'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {navigate} from '#/main/core/router'

import {select} from '../../selectors'
import {generateCorrectionGrades} from '../../utils'
import {actions} from '../actions'
import {actions as correctionActions} from '../../correction/actions'

import {Documents} from './documents.jsx'
import {CorrectionForm} from '../../correction/components/correction-form.jsx'

class PeerDrop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      correction: props.drop ?
        generateCorrectionGrades(props.drop.corrections.find(c => !c.finished && c.user.id === props.user.id), props.dropzone) :
        {}
    }
    this.updateCorrection = this.updateCorrection.bind(this)
    this.updateCorrectionCriterion = this.updateCorrectionCriterion.bind(this)
    this.saveCorrection = this.saveCorrection.bind(this)
    this.cancelCorrection = this.cancelCorrection.bind(this)
  }

  updateCorrection(property, value) {
    const correction = Object.assign({}, this.state.correction, {[property]: value})
    this.setState({correction: correction})
  }

  updateCorrectionCriterion(criterionId, value) {
    const grades = cloneDeep(this.state.correction.grades)
    const index = grades.findIndex(g => g.criterion === criterionId)

    if (index > -1) {
      const grade = Object.assign({}, grades[index], {value: value})
      grades[index] = grade
    }
    const correction = Object.assign({}, this.state.correction, {grades: grades})

    this.setState({correction: correction})
  }

  saveCorrection() {
    this.props.saveCorrection(this.state.correction)
  }

  cancelCorrection() {
    this.setState({
      correction: generateCorrectionGrades(
        this.props.drop.corrections.find(c => !c.finished && c.user.id === this.props.user.id),
        this.props.dropzone
      )
    })
    navigate('/my/drop')
  }

  render() {
    return (!!this.props.drop ?
      <div className="drop-panel">
        <Documents
          documents={this.props.drop.documents}
          canEdit={false}
          showMeta={false}
          {...this.props}
        />
        <CorrectionForm
          correction={this.state.correction}
          dropzone={this.props.dropzone}
          handleUpdate={this.updateCorrection}
          handleCriterionUpdate={this.updateCorrectionCriterion}
          handleSave={this.saveCorrection}
          handleCancel={this.cancelCorrection}
        />
        <button
          className="btn btn-primary"
          onClick={() => this.props.submitCorrection(this.state.correction.id)}
        >
          {trans('submit_correction', {}, 'dropzone')}
        </button>
      </div> :
      <div className="alert alert-warning">
        {trans('no_drop', {}, 'dropzone')}
      </div>
    )
  }
}

PeerDrop.propTypes = {
  user: T.shape({
    id: T.number.isRequired
  }),
  drop: T.shape({
    id: T.string.isRequired,
    finished: T.bool.isRequired,
    documents: T.array
  }),
  isPeerReviewEnabled: T.bool.isRequired,
  saveCorrection: T.func.isRequired,
  submitCorrection: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    user: select.user(state),
    dropzone: select.dropzone(state),
    drop: select.peerDrop(state),
    isPeerReviewEnabled: select.isPeerReviewEnabled(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveCorrection: (correction) => dispatch(correctionActions.saveCorrection(correction)),
    submitCorrection: (correctionId) => dispatch(actions.submitCorrection(correctionId))
  }
}

const ConnectedPeerDrop = connect(mapStateToProps, mapDispatchToProps)(PeerDrop)

export {ConnectedPeerDrop as PeerDrop}
