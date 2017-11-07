import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {asset} from '#/main/core/asset'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

import {constants} from '../../constants'
import {select} from '../../selectors'
import {actions} from '../actions'

class Document extends Component {
  deleteDocument(document) {
    this.props.showModal(MODAL_DELETE_CONFIRM, {
      title: trans('delete_document', {}, 'dropzone'),
      question: trans('delete_document_confirm_message', {}, 'dropzone'),
      handleConfirm: () => this.props.deleteDocument(document.id)
    })
  }

  render() {
    return (
      <tr className="drop-document">
        <td>
          {constants.DOCUMENT_TYPES_NAMES[this.props.document.type]}
        </td>
        <td>
          {this.props.document.dropDate}
        </td>
        <td>
          {this.props.document.type === constants.DOCUMENT_TYPES.file.value ?
            <a
              href={asset(this.props.document.data.url)}
              download={this.props.document.data.name}
            >
              {this.props.document.data.name}
            </a> :
            this.props.document.type === constants.DOCUMENT_TYPES.text.value ?
              <HtmlText>{this.props.document.data}</HtmlText> :
              this.props.document.type === constants.DOCUMENT_TYPES.url.value ?
                <a href={this.props.document.data}>{this.props.document.data}</a> :
                this.props.document.type === constants.DOCUMENT_TYPES.resource.value ?
                  'resource' :
                  ''
          }
        </td>
        <td>
          <span
            className="fa fa-w fa-trash pointer-hand"
            onClick={() => this.deleteDocument(this.props.document)}
          />
        </td>
      </tr>
    )
  }
}

Document.propTypes = {
  document: T.shape({
    id: T.string.isRequired,
    type: T.number.isRequired,
    data: T.oneOfType([T.string, T.object]).isRequired,
    dropDate: T.string.isRequired
  }),
  deleteDocument: T.func.isRequired,
  showModal: T.func.isRequired
}

export const Documents = props =>
  <div id="drop-documents">
    {props.documents.length > 0 &&
      <table className="table">
        <tbody>
          {props.documents.map(d =>
            <Document
              key={`document-${d.id}`}
              document={d}
              {...props}
            />
          )}
        </tbody>
      </table>
    }
  </div>

Documents.propTypes = {
  documents: T.array
}