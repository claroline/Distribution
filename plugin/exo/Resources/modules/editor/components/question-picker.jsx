import React, {Component, PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import {trans, t} from './../lib/translate'

/* global Routing $ */

class QuestionPicker extends Component {
  constructor(props){
    super(props)
    // @TODO retrive question list from API
    const questions = [
      {
        id: '1',
        title: 'Question 1',
        question: 'Veuillez me répondre',
        type: 'application/x.open+json'
      },
      {
        id: '2',
        title: 'Question 2',
        question: 'Oui ou non?',
        type: 'application/x.choice+json'
      }
    ]

    this.state = {
      question: null,
      type:null,
      questions: questions,
      types:[
        {
          mime:'application/x.choice+json',
          name:trans('choice')
        },
        {
          mime:'application/x.open+json',
          name:trans('open')
        },
        {
          mime:'application/x.words+json',
          name:trans('words')
        },
        {
          mime:'application/x.match+json',
          name:trans('match')
        },
        {
          mime:'application/x.graphic+json',
          name:trans('graphic')
        },
        {
          mime:'application/x.cloze+json',
          name:trans('cloze')
        }
      ]
    }

    this.getData()
  }

  getData(){
    const url = Routing.generate('question_list')
    const myHeaders = new Headers({
      'Access-Control-Allow-Origin':'*'
    })
    var myInit = {
      method: 'POST' ,
      headers: myHeaders,
      mode: 'cors',
      cache: 'default',
      credentials: 'include'
    }

    fetch(url, myInit)
    .then(function(response) {
      console.log(response)
      //return response.blob()
    })
    .then(function(myBlob) {
      //var objectURL = URL.createObjectURL(myBlob)
      //myImage.src = objectURL
    })

    /*fetch(url, {
      method: 'post',
      headers : new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }).then(function(response) {
    	console.log(response)
      return response.json()
    }).then(function(json){
      console.log(json)
    }).catch(function(err) {
    	console.log(err)
    })*/

    /*const req = new XMLHttpRequest()
    req.open('POST', url, true)
    req.onreadystatechange = function (aEvt) {
      if (req.readyState == 4) {
        if(req.status == 200){
          console.log(req.response)
        }
        else{
          console.log('Erreur pendant le chargement de la page.\n')
        }

      }
    }
    req.send(null)*/

    /*$.ajax({
      url: url,
      method:'POST',
      success: function(result){
        console.log(result)
      }
    })*/


  }

  handleClick(){
    this.props.handleSelect(this.state.question)
    this.props.fadeQuestionPicker()
  }

  getTypeName(mimeType){
    const type = this.state.types.find(type => type.mime === mimeType)
    return undefined !== type ? type.name: 'not found'
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
          <form className="form-inline">
            <div className="form-group">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Titre / Question" />
                <div className="input-group-addon">
                      <span className="fa fa-search"></span>
                </div>
              </div>
            </div>
            <div className="form-group" style={{paddingLeft:'15px'}}>
              <div className="btn-group">
                <button className="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  &nbsp;{trans('Choisir un type')}&nbsp;
                  <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a role="button" onClick={() => this.setState({type: null})}>{trans('Tous')}</a>
                  </li>
                  {
                    this.state.types.map((type,index) =>
                      <li key={index}>
                        <a role="button" onClick={() => this.setState({type: type.mime})}>{type.name}</a>
                      </li>
                    )
                  }
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
              {this.state.questions.map(question =>
                <tr key={question.id}>
                  <td>
                    <input name="question" type="radio" onChange={() => this.handleQuestionSelection(question)} value={question.id} />
                  </td>
                  <td>{question.title}</td>
                  <td>{question.question}</td>
                  <td>{this.getTypeName(question.type)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default" onClick={this.props.fadeQuestionPicker}>
            {t('cancel')}
          </button>
          <button className="btn btn-primary" onClick={this.handleClick.bind(this)}>
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
