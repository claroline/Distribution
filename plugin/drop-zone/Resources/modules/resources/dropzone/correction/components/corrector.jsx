import React from 'react'
import moment from 'moment'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {navigate} from '#/main/core/router'
import {t, trans} from '#/main/core/translation'

import {DropzoneType, DropType, CorrectionType} from '#/plugin/drop-zone/resources/dropzone/prop-types'
import {select} from '#/plugin/drop-zone/resources/dropzone/selectors'

const Corrections = props => props.corrections && props.corrections.length > 0 ?
  <table className="table">
    <thead>
      <tr>
        <th></th>
        <th>{trans('drop_author', {}, 'dropzone')}</th>
        <th>{t('start_date')}</th>
        <th>{trans('last_edition_date', {}, 'dropzone')}</th>
        <th>{trans('finished', {}, 'dropzone')}</th>
        <th>{t('score')}</th>
      </tr>
    </thead>
    <tbody>
      {props.corrections.map(c =>
        <tr key={`corrector-correction-${c.id}`}>
          <td>{c.correctionDenied ? <span className='fa fa-fw fa-warning'/> : ''}</td>
          <td>{c.user ? `${c.user.firstName} ${c.user.lastName}` : c.role.name}</td>
          <td>{moment(c.startDate).format('YYYY-MM-DD HH:mm')}</td>
          <td>{moment(c.lastEditionDate).format('YYYY-MM-DD HH:mm')}</td>
          <td>{c.finished ? <span className='fa fa-fw fa-check true'/> : <span className='fa fa-fw fa-times false'/>}</td>
          <td>{c.score ? `${c.score} / ${props.dropzone.parameters.scoreMax}` : '-'}</td>
        </tr>
      )}
    </tbody>
  </table> :
  <div className="alert alert-warning">
    {trans('no_correction', {}, 'dropzone')}
  </div>

Corrections.propTypes = {
  dropzone: T.shape(DropzoneType.propTypes).isRequired,
  corrections: T.arrayOf(T.shape(CorrectionType.propTypes))
}



const Corrector = props => !props.drop || !props.corrections ?
  <span className="fa fa-fw fa-circle-o-notch fa-spin"></span> :
  <div id="corrector-container">
    <h2>{props.drop.user ? `${props.drop.user.firstName} ${props.drop.user.lastName}` : props.drop.role.name}</h2>
    <Corrections
      corrections={props.drop.user ? props.corrections[props.drop.user.id] : props.corrections[props.drop.role.name]}
      dropzone={props.dropzone}
    />
  </div>

Corrector.propTypes = {
  dropzone: T.shape(DropzoneType.propTypes).isRequired,
  drop: T.shape(DropType.propTypes),
  corrections: T.object
}

function mapStateToProps(state) {
  return {
    dropzone: select.dropzone(state),
    drop: select.correctorDrop(state),
    corrections: select.corrections(state)
  }
}

function mapDispatchToProps() {
  return {}
}

const ConnectedCorrector = connect(mapStateToProps, mapDispatchToProps)(Corrector)

export {ConnectedCorrector as Corrector}