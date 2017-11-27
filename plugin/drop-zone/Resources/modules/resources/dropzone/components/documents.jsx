import React from 'react'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {asset} from '#/main/core/asset'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

import {constants} from '#/plugin/drop-zone/resources/dropzone/constants'
import {constants as configConstants} from '#/plugin/drop-zone/plugin/configuration/constants'
import {DocumentType} from '#/plugin/drop-zone/resources/dropzone/prop-types'

const Document = props =>
  <tr className="drop-document">
    <td className="document-type">
      {constants.DOCUMENT_TYPES_NAMES[props.document.type]}
    </td>
    {props.showMeta &&
      <td className="document-date">
        {props.document.dropDate}
      </td>
    }
    <td className="document-data">
      {props.document.type === constants.DOCUMENT_TYPES.file.value ?
        <a
          href={asset(props.document.data.url)}
          download={props.document.data.name}
        >
          {props.document.data.name}
        </a> :
        props.document.type === constants.DOCUMENT_TYPES.text.value ?
          <HtmlText>{props.document.data}</HtmlText> :
          props.document.type === constants.DOCUMENT_TYPES.url.value ?
            <a href={props.document.data}>{props.document.data}</a> :
            props.document.type === constants.DOCUMENT_TYPES.resource.value ?
              'resource' :
              ''
      }
    </td>
    {props.canEdit &&
      <td>
        <span
          className="fa fa-w fa-trash pointer-hand"
          onClick={() => {
            props.showModal(MODAL_DELETE_CONFIRM, {
              title: trans('delete_document', {}, 'dropzone'),
              question: trans('delete_document_confirm_message', {}, 'dropzone'),
              handleConfirm: () => props.deleteDocument(props.document.id)
            })
          }}
        />
      </td>
    }
    {props.showTools &&
      <td>
        {props.tools.map(t =>
          <button
            key={`tool-btn-${t.id}`}
            className="btn btn-default"
            onClick={() => props.executeTool(t.id, props.document.id)}
          >
            {t.name}
          </button>
        )}
        {props.document.toolDocuments.length > 0 && props.document.toolDocuments.map(td => {
          if (td.type === configConstants.compilatioValue && td.data && td.data.reportUrl) {
            return (
              <button
                className="btn btn-default"
                onClick={() => window.open(td.data.reportUrl, '_blank')}
              >
                {trans('report', {}, 'dropzone')}
              </button>
            )
          } else {
            return ''
          }
        })}
      </td>
    }
  </tr>

Document.propTypes = {
  canEdit: T.bool.isRequired,
  showMeta: T.bool.isRequired,
  showTools: T.bool.isRequired,
  document: T.shape(DocumentType.propTypes),
  tools: T.array,
  deleteDocument: T.func,
  executeTool: T.func,
  showModal: T.func
}

export const Documents = props =>
  <div id="drop-documents">
    <h2>{trans('documents_added_to_copy', {}, 'dropzone')}</h2>
    {props.documents.length > 0 ?
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
      </table> :
      <div className="alert alert-warning">
        {trans('no_document', {}, 'dropzone')}
      </div>
    }
  </div>

Documents.propTypes = {
  documents: T.arrayOf(T.shape(DocumentType.propTypes))
}

Documents.defaultProps = {
  canEdit: false,
  showMeta: true,
  showTools: false
}