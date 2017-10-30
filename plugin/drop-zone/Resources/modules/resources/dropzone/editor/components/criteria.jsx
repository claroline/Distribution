import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/core/translation'
import {HtmlGroup}  from '#/main/core/layout/form/components/group/html-group.jsx'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

import {select} from '../../selectors'
import {actions} from '../actions'

class Criterion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: !props.criterion.instruction
    }
  }

  render() {
    return (
      <div className="criterion-row">
        {this.state.editMode ?
          <HtmlGroup
            controlId={`criterion-textarea-${this.props.criterion.id}`}
            className="criterion-content"
            label="no_label"
            hideLabel={true}
            content={this.props.criterion.instruction || ''}
            onChange={value => this.props.handleChange(this.props.criterion.id, 'instruction', value)}
            minRows={3}
            warnOnly={!this.props.validating}
            error={get(this.props.errors, `criterion.${this.props.criterion.id}`)}
          /> :
          <HtmlText className="criterion-content">
            {this.props.criterion.instruction}
          </HtmlText>
        }
        <div className="criterion-btn-group">
          <button
            className="btn btn-default btn-sm"
            disabled={!this.props.criterion.instruction}
            onClick={() => this.setState({editMode: !this.state.editMode})}
          >
            <span className="fa fa-w fa-pencil"/>
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => this.props.handleDelete(this.props.criterion.id)}
          >
            <span className="fa fa-w fa-trash"/>
          </button>
        </div>
      </div>
    )
  }
}

Criterion.propTypes = {
  errors: T.object,
  validating: T.bool,
  criterion: T.shape({
    id: T.string.isRequired,
    instruction: T.string
  }).isRequired,
  handleChange: T.func.isRequired,
  handleDelete: T.func.isRequired
}

const Criteria = props =>
  <div>
    <button
      className="btn btn-primary"
      onClick={() => props.addCriterion(props.dropzoneId)}
    >
      <span className="fa fa-w fa-plus"></span>
      {trans('add_criterion', {}, 'dropzone')}
    </button>
    {props.criteria.map(c =>
      <Criterion
        key={`criterion-${c.id}`}
        criterion={c}
        validating={props.validating}
        errors={props.errors}
        handleChange={props.updateCriterion}
        handleDelete={props.removeCriterion}
      />
    )}
  </div>

Criteria.propTypes = {
  errors: T.object,
  validating: T.bool,
  dropzoneId: T.string.isRequired,
  criteria: T.array.isRequired,
  addCriterion: T.func.isRequired,
  updateCriterion: T.func.isRequired,
  removeCriterion: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    dropzoneId: select.dropzoneId(state),
    criteria: select.formCriteriaData(state),
    errors: select.formErrors(state),
    validating: select.formValidating(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addCriterion: (dropzoneId) => dispatch(actions.addCriterion(dropzoneId)),
    updateCriterion: (id, property, value) => dispatch(actions.updateCriterion(id, property, value)),
    removeCriterion: (id) => dispatch(actions.removeCriterion(id))
  }
}

const ConnectedCriteria = connect(mapStateToProps, mapDispatchToProps)(Criteria)

export {
  ConnectedCriteria as Criteria
}
