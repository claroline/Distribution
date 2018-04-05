import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {select as resourceSelect} from '#/main/core/resource/selectors'

import {Keyword as KeywordType} from '#/plugin/claco-form/resources/claco-form/prop-types'
import {actions} from '#/plugin/claco-form/resources/claco-form/editor/keyword/actions'

class KeywordsComponent extends Component {
  showKeywordCreationForm() {
    this.props.showModal(
      'MODAL_KEYWORD_FORM',
      {
        title: trans('create_a_keyword', {}, 'clacoform'),
        confirmAction: (keyword) => this.props.createKeyword(keyword),
        keyword: {
          id: 0,
          name: ''
        },
        resourceId: this.props.resourceId
      }
    )
  }

  showKeywordEditionForm(keyword) {
    this.props.showModal(
      'MODAL_KEYWORD_FORM',
      {
        title: trans('edit_keyword', {}, 'clacoform'),
        confirmAction: (k) => this.props.editKeyword(k),
        keyword: {
          id: keyword.id,
          name: keyword.name
        },
        resourceId: this.props.resourceId
      }
    )
  }

  showKeywordDeletion(keyword) {
    this.props.showModal(MODAL_DELETE_CONFIRM, {
      title: trans('delete_keyword', {}, 'clacoform'),
      question: trans('delete_keyword_confirm_message', {name: keyword.name}, 'clacoform'),
      handleConfirm: () => this.props.deleteKeyword(keyword.id)
    })
  }

  render() {
    return (
      <div>
        <h2>{trans('keywords_management', {}, 'clacoform')}</h2>
        <br/>
        {this.props.canEdit ?
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>{trans('name')}</th>
                  <th>{trans('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {this.props.keywords.map((keyword) =>
                  <tr key={`keyword-${keyword.id}`}>
                    <td>
                      {keyword.name}
                    </td>
                    <td>
                      <button
                        className="btn btn-default btn-sm"
                        onClick={() => this.showKeywordEditionForm(keyword)}
                      >
                        <span className="fa fa-fw fa-pencil"></span>
                      </button>
                      &nbsp;
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => this.showKeywordDeletion(keyword)}
                      >
                        <span className="fa fa-fw fa-trash"></span>
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <button className="btn btn-primary" onClick={() => this.showKeywordCreationForm()}>
              <span className="fa fa-fw fa-plus"></span>
              &nbsp;
              {trans('create_a_keyword', {}, 'clacoform')}
            </button>
          </div> :
          <div className="alert alert-danger">
            {trans('unauthorized')}
          </div>
        }
      </div>
    )
  }
}

KeywordsComponent.propTypes = {
  canEdit: T.bool.isRequired,
  resourceId: T.number.isRequired,
  keywords: T.arrayOf(T.shape(KeywordType.propTypes)).isRequired,
  createKeyword: T.func.isRequired,
  editKeyword: T.func.isRequired,
  deleteKeyword: T.func.isRequired,
  showModal: T.func.isRequired
}

const Keywords = connect(
  (state) => ({
    canEdit: resourceSelect.editable(state),
    resourceId: state.clacoForm.id,
    keywords: state.keywords
  }),
  (dispatch) => ({
    createKeyword: (data) => dispatch(actions.createKeyword(data)),
    editKeyword: (data) => dispatch(actions.editKeyword(data)),
    deleteKeyword: (keywordId) => dispatch(actions.deleteKeyword(keywordId)),
    showModal: (type, props) => dispatch(modalActions.showModal(type, props))
  })
)(KeywordsComponent)

export {
  Keywords
}