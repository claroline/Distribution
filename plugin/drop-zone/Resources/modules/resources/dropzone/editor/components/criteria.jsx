import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
//import {HtmlGroup}  from '#/main/core/layout/form/components/group/html-group.jsx'
import {Textarea} from '#/main/core/layout/form/components/field/textarea.jsx'

import {select} from '../../selectors'
import {actions} from '../actions'

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
      <div key={`criterion-${c.id}`}>
        <Textarea
          id={`textarea-${c.id}`}
          content={c.instruction || ''}
          onChange={value => props.updateCriterion(c.id, 'instruction', value)}
          minRows={3}
        />
        <span
          className="fa fa-w fa-trash"
          onClick={() => props.removeCriterion(c.id)}
        />
      </div>
    )}
  </div>

Criteria.propTypes = {
  dropzoneId: T.string.isRequired,
  criteria: T.arrayOf(T.shape({
    id: T.string.isRequired,
    instruction: T.string
  })).isRequired,
  addCriterion: T.func.isRequired,
  updateCriterion: T.func.isRequired,
  removeCriterion: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    dropzoneId: select.dropzoneId(state),
    criteria: select.formCriteriaData(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addCriterion: (dropzoneId) => dispatch(actions.addCriterion(dropzoneId)),
    updateCriterion: (id, property, value) => dispatch(actions.updateCriterion(id, property, value)),
    removeCriterion: (id) => dispatch(actions.removeCriterion(id)),
  }
}

const ConnectedCriteria = connect(mapStateToProps, mapDispatchToProps)(Criteria)

export {
  ConnectedCriteria as Criteria
}
