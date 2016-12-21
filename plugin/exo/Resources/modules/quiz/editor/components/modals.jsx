import React, {Component, PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import classes from 'classnames'
import {listItemMimeTypes, getDefinition, listItemNames as listTypes} from './../../../items/item-types'
import {t, tex, trans} from './../../../utils/translate'
import {generateUrl} from './../../../utils/routing'

export const MODAL_ADD_ITEM = 'ADD_ITEM'
export const MODAL_CONFIRM = 'CONFIRM'
export const MODAL_DELETE_CONFIRM = 'DELETE_CONFIRM'
export const MODAL_IMPORT_ITEMS = 'MODAL_IMPORT_ITEMS'

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


class ImportItemsModal extends Component {
  constructor(props){
    super(props)

    const types = listTypes()
    this.state = {
      selected: [],
      criterion: null,
      questions: [],
      total: 0,
      types: types
    }
  }

  handleSearchTextChange(value){
    this.setState({criterion: value})
    // refresh results
    this.getQuestions()
  }

  handleQuestionSelection(question){
    let actual = this.state.selected
    actual.push(question)
    this.setState({selected: actual})
  }

  getQuestions(){
    const url = generateUrl('question_list')
    const params = {
      method: 'GET' ,
      credentials: 'include'
    }

    fetch(url, params)
    .then(response => {
      return response.json()
    })
    .then(jsonData =>  {
      this.setState({questions: jsonData.questions, total: jsonData.total})
    })
  }

  handleClick(){
    if (this.state.selected.length > 0) {
      this.props.handleSelect(this.state.selected)
    }
    // close picker
    this.props.fadeModal()
  }

  getTypeName(mimeType){
    const type = this.state.types.find(type => type.type === mimeType)
    return undefined !== type ? trans(type.name, {}, 'question_types'): t('error')
  }

  render(){
    return(
      <BaseModal {...this.props} className="import-items-modal">
        <Modal.Body>
          <div className="form-group">
            <input
              id="searchText"
              placeholder={tex('search_by_title_or_content')}
              type="text"
              onChange={(e) => this.handleSearchTextChange(e.target.value)}
              className="form-control" />
          </div>
          { this.state.questions.length === 0 && null !== this.state.criterion && '' !== this.state.criterion &&
            <div className="text-center">
              <hr/>
              <h4>{t('no_search_results')}</h4>
            </div>
          }
        </Modal.Body>
        {this.state.questions.length > 0 &&
          <table className="table table-responsive table-striped question-list-table">
            <tbody>
              {this.state.questions.map(item =>
                <tr key={item.id}>
                  <td>
                    <input name="question" type="checkbox" onClick={() => this.handleQuestionSelection(item)} />
                  </td>
                  <td>{item.title ? item.title : item.content }</td>
                </tr>
              )}
            </tbody>
          </table>
        }
        <Modal.Footer>
          <button className="btn btn-default" onClick={this.props.fadeModal}>
            {t('cancel')}
          </button>
          <button className="btn btn-primary" disabled={this.state.selected.length === 0} onClick={this.handleClick.bind(this)}>
            {t('ok')}
          </button>
        </Modal.Footer>
      </BaseModal>
    )
  }
}

ImportItemsModal.propTypes = {
  handleSelect: T.func.isRequired,
  fadeModal: T.func.isRequired
}

export default {
  [MODAL_ADD_ITEM]: AddItemModal,
  [MODAL_CONFIRM]: ConfirmModal,
  [MODAL_DELETE_CONFIRM]: DeleteConfirmModal,
  [MODAL_IMPORT_ITEMS]: ImportItemsModal
}
