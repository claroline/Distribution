import React, {Component, PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import {trans, t, tex} from './../lib/translate'
import {listItemNames as listTypes} from './../item-types'

/* global Routing */

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
    /*const url = Routing.generate('question_list')
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
    })*/

    const questions = [
      {
        id: '1',
        title: 'Question 1',
        question: 'Veuillez me répondre',
        type: 'application/x.open+json',
        feedback: '',
        hints:[],
        maxScore: 10,
        maxLength: 255
      },
      {
        id: '2',
        title: null,
        question: 'Oui ou non?',
        type: 'application/x.choice+json',
        feedback: '',
        hints:[],
        choices: [

        ]
      }
    ]

    this.setState({questions: questions})
  }

  handleClick(){
    if (this.state.selected.length > 0) {
      this.props.handleSelect(this.state.selected)
    }

    this.props.fadeQuestionPicker()
  }

  getTypeName(mimeType){
    const type = this.state.types.find(type => type.type === mimeType)
    return undefined !== type ? trans(type.name, {}, 'question_types'): t('error')
  }

  render(){
    return(
      <Modal
        show={this.props.show}
        onHide={this.props.fadeQuestionPicker}
        onExited={this.props.hideQuestionPicker}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input id="searchText" placeholder={tex('Titre / Question')} type="text" onChange={(e) => this.handleSearchTextChange(e.target.value)} className="form-control" />

          {this.state.questions.length > 0 &&
            <table className="table table-striped">
              <tbody>
                {this.state.questions.map(item =>
                  <tr key={item.id}>
                    <td>
                      <input name="question" type="checkbox" onClick={() => this.handleQuestionSelection(item)} />
                    </td>
                    <td>{item.title ? item.title : item.question }</td>
                  </tr>
                )}
              </tbody>
            </table>
          }
          { this.state.questions.length === 0 &&
            <h5>{t('no_search_results')}</h5>
          }
        </Modal.Body>
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
