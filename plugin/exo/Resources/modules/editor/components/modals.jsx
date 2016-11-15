import React, {PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import classes from 'classnames'
import {listItemMimeTypes, getDefinition} from './../item-types'
import {t, trans} from './../lib/translate'

export const MODAL_ADD_ITEM = 'ADD_ITEM'
export const MODAL_CONFIRM = 'CONFIRM'
export const MODAL_DELETE_CONFIRM = 'DELETE_CONFIRM'
export const MODAL_PICK_QUESTION = 'PICK_QUESTION'

const BaseModal = props =>
  <Modal
    show={props.show}
    onHide={props.fadeModal}
    onExited={props.hideModal}
    dialogClassName={props.className}
  >
    <Modal.Header closeButton>
      <Modal.Title>{props.title}</Modal.Title>
    </Modal.Header>
    {props.children}
  </Modal>

BaseModal.propTypes = {
  fadeModal: T.func.isRequired,
  hideModal: T.func.isRequired,
  show: T.bool.isRequired,
  title: T.string.isRequired,
  className: T.string,
  children: T.oneOfType([T.object, T.array]).isRequired
}

// required when testing proptypes on code instrumented by istanbul
// @see https://github.com/facebook/jest/issues/1824#issuecomment-250478026
BaseModal.displayName = 'BaseModal'

const ConfirmModal = props =>
  <BaseModal {...props}>
    <Modal.Body>
      {props.question}
    </Modal.Body>
    <Modal.Footer>
      <button
        className="btn btn-default"
        onClick={props.fadeModal}
      >
        {t('cancel')}
      </button>
      <button
        className={classes('btn', props.isDangerous ? 'btn-danger' : 'btn-primary')}
        onClick={() => {
          props.handleConfirm()
          props.fadeModal()
        }}
      >
        {props.confirmButtonText || t('Ok')}
      </button>
    </Modal.Footer>
  </BaseModal>

ConfirmModal.propTypes = {
  confirmButtonText: T.string,
  isDangerous: T.bool,
  question: T.string.isRequired,
  handleConfirm: T.func.isRequired,
  fadeModal: T.func.isRequired
}

const DeleteConfirmModal = props =>
  <ConfirmModal
    confirmButtonText={t('delete')}
    isDangerous={true}
    {...props}
  />

const AddItemModal = props =>
  <BaseModal {...props} className="add-item-modal">
    <Modal.Body>
      <div role="listbox">
        {listItemMimeTypes().map(type =>
          <div
            key={type}
            className="modal-item-entry"
            role="option"
            onClick={() => props.handleSelect(type)}
          >
            <svg className="icon-large">
              <use xlinkHref={`#icon-${getDefinition(type).name}`}/>
            </svg>
            <div className="modal-item-desc">
              <span className="modal-item-name">
                {trans(getDefinition(type).name, {}, 'question_types')}
              </span>
              <p>
                {trans(`${getDefinition(type).name}_desc`, {}, 'question_types')}
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal.Body>
  </BaseModal>

AddItemModal.propTypes = {
  handleSelect: T.func.isRequired
}

const PickQuestionModal = props =>
  <BaseModal {...props} className="pick-question-modal">
    <Modal.Body>
      <form className="form-inline">
        <div className="form-group">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Titre / Question" />
            <div className="input-group-addon">
              <span className="fa fa-search"></span>
            </div>
          </div>
        </div>
        <div className="form-group" style={{paddingLeft:'15px;'}}>
          <div className="btn-group">
            <button className="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              &nbsp;{trans('Choisir un type')}&nbsp;
              <span className="caret"></span>
            </button>
            <ul className="dropdown-menu">
              <li>
                <a role="button" onClick={() => {}}>{trans('Tous')}</a>
              </li>
              <li>
                <a role="button" onClick={() => {}}>{trans('Ouverte')}</a>
              </li>
              <li>
                <a role="button" onClick={() => {}}>{trans('Choix')}</a>
              </li>
              <li>
                <a role="button" onClick={() => {}}>{trans('Classement')}</a>
              </li>
              <li>
                <a role="button" onClick={() => {}}>{trans('Panier')}</a>
              </li>
              <li>
                <a role="button" onClick={() => {}}>{trans('Mots clés')}</a>
              </li>
            </ul>
          </div>
        </div>
      </form>
      <hr/>
      <table className="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>Titre</th>
            <th>Invite</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input name="question" type="radio"></input></td>
            <td>Question 1</td>
            <td>Répondez bien répondee rien</td>
            <td>Ouverte</td>
          </tr>
          <tr>
            <td><input name="question" type="radio"></input></td>
            <td>Question 2</td>
            <td>Oui ou non ?</td>
            <td>Choix</td>
          </tr>
        </tbody>
      </table>
    </Modal.Body>
  </BaseModal>

PickQuestionModal.propTypes = {
  handleSelect: T.func.isRequired
}

export default {
  [MODAL_PICK_QUESTION]: PickQuestionModal,
  [MODAL_ADD_ITEM]: AddItemModal,
  [MODAL_CONFIRM]: ConfirmModal,
  [MODAL_DELETE_CONFIRM]: DeleteConfirmModal
}
