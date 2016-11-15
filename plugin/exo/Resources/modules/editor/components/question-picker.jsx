import React, {Component, PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import {trans} from './../lib/translate'


class QuestionPicker extends Component {
  constructor(props){
    super(props)
    console.log(props)
    this.state = {
      show: this.props.show
    }

  }

  close(){
    this.setState({
      show: !this.state.show
    })
  }

  addQuestion(){
    const question = {
      title: 'test'
    }
    console.log(this.props)
    this.props.handleSelect(question)
  }

  render(){
    return(
      <Modal
        show={this.state.show}
        onHide={this.close.bind(this)}
        onExited={this.addQuestion.bind(this)}
          >
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
            <Modal.Footer>
              <a role="button" onClick={this.close.bind(this)}>Close</a>
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
