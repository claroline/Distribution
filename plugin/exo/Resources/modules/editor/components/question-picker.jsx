import React, {Component, PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import {trans, t, tex} from './../lib/translate'
import {listItemNames as listTypes} from './../item-types'
import {generateUrl} from './../lib/routing'


class QuestionPicker extends Component {
  constructor(props){
    super(props)

    const types = listTypes()

    this.state = {
      selected: [],
      criterion: null,
      questions: [],
      types: types
    }
  }

  handleSearchTextChange(value){
    this.setState({criterion: value})
    // @TODO refresh results
    this.getQuestions()
  }

  handleQuestionSelection(question){
    let actual = this.state.selected
    actual.push(question)
    this.setState({selected: actual})
  }

  componentDidMount() {
    this.getQuestions()
  }

  getQuestions(){
    const url = generateUrl('question_list')
    const params = {
      method: 'POST' ,
      credentials: 'include'
    }

    fetch(url, params)
    .then(response => {
      return response.json()
    })
    .then( jsonData =>  {
      let questions = jsonData.owned.concat(jsonData.shared)
      this.setState({questions: questions})
    })
  }

  handleClick(){
    if (this.state.selected.length > 0) {
      this.props.handleSelect(this.state.selected)
    }
    // close picker
    this.props.fadeQuestionPicker()
  }

  getTypeName(mimeType){
    const type = this.state.types.find(type => type.type === mimeType)
    return undefined !== type ? trans(type.name, {}, 'question_types'): t('error')
  }

  render(){
    return(
      <Modal
        className="pick-question-modal"
        show={this.props.show}
        onHide={this.props.fadeQuestionPicker}
        onExited={this.props.hideQuestionPicker}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <input id="searchText" placeholder={tex('search_by_title_or_content')} type="text" onChange={(e) => this.handleSearchTextChange(e.target.value)} className="form-control" />
          </div>

          { this.state.questions.length === 0 &&
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
          <button className="btn btn-default" onClick={this.props.fadeQuestionPicker}>
            {t('cancel')}
          </button>
          <button className="btn btn-primary" disabled={this.state.selected.length === 0} onClick={this.handleClick.bind(this)}>
            {t('ok')}
          </button>
        </Modal.Footer>
      </Modal>
    )
  }
}

QuestionPicker.propTypes = {
  handleSelect: T.func.isRequired,
  show: T.bool.isRequired,
  title: T.string.isRequired,
  fadeQuestionPicker: T.func.isRequired,
  hideQuestionPicker: T.func.isRequired
}

export {QuestionPicker}
