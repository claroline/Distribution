import React, {Component, PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import {listItemNames} from './../../../items/item-types'
import {t, tex, trans} from './../../../utils/translate'
import {generateUrl} from './../../../utils/routing'
import {BaseModal} from './../../../modal/components/base.jsx'

export const MODAL_IMPORT_ITEMS = 'MODAL_IMPORT_ITEMS'

export class ImportItemsModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      selected: [],
      criterion: null,
      questions: [],
      total: 0,
      types: listItemNames()
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
