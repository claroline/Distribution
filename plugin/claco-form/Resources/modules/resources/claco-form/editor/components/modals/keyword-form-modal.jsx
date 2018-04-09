import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import Modal from 'react-bootstrap/lib/Modal'
import classes from 'classnames'

import {trans} from '#/main/core/translation'
import {generateUrl} from '#/main/core/api/router'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {BaseModal} from '#/main/core/layout/modal/components/base.jsx'

import {Keyword as KeywordType} from '#/plugin/claco-form/resources/claco-form/prop-types'
import {actions} from '#/plugin/claco-form/resources/claco-form/editor/actions'

const MODAL_KEYWORD_FORM = 'MODAL_KEYWORD_FORM'

class KeywordFormModalComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching : false,
      hasError: false,
      nameError: null,
      id: props.keyword.id,
      name: props.keyword.name
    }
  }

  checkKeywordName() {
    if (this.state.name) {
      this.setState({isFetching: true})

      fetch(
        generateUrl(
          'claro_claco_form_get_keyword_by_name_excluding_id',
          {clacoForm: this.props.resourceId, name: this.state.name, id: this.props.keyword.id}
        ),
        {
          method: 'GET' ,
          credentials: 'include'
        }
      )
        .then(response => response.json())
        .then(results => {
          if (JSON.parse(results) === null) {
            this.registerKeyword()
            this.setState({isFetching: false})
          } else {
            this.setState({
              hasError: true,
              nameError: trans('form_not_unique_error', {}, 'clacoform'),
              isFetching: false
            })
          }
        })
    }
  }

  updateKeywordProps(property, value) {
    this.setState({[property]: value})
  }

  registerKeyword() {
    if (!this.state['hasError']) {
      this.props.saveKeyword(this.state)
      this.props.fadeModal()
    }
  }

  validateKeyword() {
    const validation = {
      hasError: false,
      nameError: null
    }

    if (!this.state['name']) {
      validation['nameError'] = trans('form_not_blank_error', {}, 'clacoform')
      validation['hasError'] = true
    }
    this.setState(validation, this.checkKeywordName)
  }

  render() {
    return (
      <BaseModal {...this.props}>
        <Modal.Body>
          <div className={classes('form-group form-group-align row', {'has-error': this.state.nameError})}>
            <label className="control-label col-md-3">
              {trans('name')}
            </label>
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                value={this.state.name}
                onChange={e => this.updateKeywordProps('name', e.target.value)}
              />
              {this.state.nameError &&
              <div className="help-block field-error">
                {this.state.nameError}
              </div>
              }
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default" onClick={this.props.fadeModal}>
            {trans('cancel')}
          </button>
          <button className="btn btn-primary" onClick={() => this.validateKeyword()}>
            {this.state.isFetching ?
              <span className="fa fa-fw fa-circle-o-notch fa-spin"></span> :
              <span>{trans('ok')}</span>
            }
          </button>
        </Modal.Footer>
      </BaseModal>
    )
  }
}

KeywordFormModalComponent.propTypes = {
  resourceId:T.number.isRequired,
  keyword: T.shape(KeywordType.propTypes).isRequired,
  saveKeyword: T.func.isRequired,
  fadeModal: T.func.isRequired
}

const KeywordFormModal = connect(
  (state) => ({
    resourceId: state.clacoForm.id
  }),
  (dispatch) => ({
    saveKeyword(keyword) {
      dispatch(actions.saveKeyword(keyword))
    },
    fadeModal() {
      dispatch(modalActions.fadeModal())
    }
  })
)(KeywordFormModalComponent)

export {
  MODAL_KEYWORD_FORM,
  KeywordFormModal
}