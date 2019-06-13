import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {displayDate} from '#/main/app/intl/date'

import {Revision as RevisionType} from '#/plugin/drop-zone/resources/dropzone/prop-types'
import {select} from '#/plugin/drop-zone/resources/dropzone/store/selectors'
import {Documents} from '#/plugin/drop-zone/resources/dropzone/components/documents'
import {Comments} from '#/plugin/drop-zone/resources/dropzone/player/components/comments'

const RevisionComponent = props => props.revision ?
  <section className="resource-section revision-panel">
    <h2>{trans('revision', {}, 'dropzone')}</h2>

    <table className="revision-table table table-responsive table-bordered">
      <tbody>
        <tr>
          <th>{trans('creator')}</th>
          <td>{props.revision.creator ? `${props.revision.creator.firstName} ${props.revision.creator.lastName}` : trans('unknown')}</td>
        </tr>
        <tr>
          <th>{trans('creation_date')}</th>
          <td>{displayDate(props.revision.creationDate, false, true)}</td>
        </tr>
      </tbody>
    </table>

    <Documents
      documents={props.revision.documents}
      {...props}
    />

    <Comments
      comments={props.revision.comments}
      revisionId={props.revision.id}
    />
  </section> :
  <div>
  </div>

RevisionComponent.propTypes = {
  revision: T.shape(RevisionType.propTypes)
}

const Revision = connect(
  (state) => ({
    revision: select.revision(state)
  })
)(RevisionComponent)

export {
  Revision
}
