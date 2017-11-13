import React from 'react'
import {PropTypes as T} from 'prop-types'
import {t, trans} from '#/main/core/translation'

import {CorrectionRow} from './correction-row.jsx'

export const Corrections = props =>
  <table className="table corrections-table">
    <thead>
      <tr>
        <th></th>
        <th>{trans('corrector', {}, 'dropzone')}</th>
        <th>{trans('start_date', {}, 'dropzone')}</th>
        <th>{trans('end_date', {}, 'dropzone')}</th>
        <th>{trans('score', {}, 'dropzone')}</th>
        <th>{t('actions')}</th>
      </tr>
    </thead>
    <tbody>
    {props.corrections.map(c =>
      <CorrectionRow
        key={`correction-row-${c.id}`}
        correction={c}
      />
    )}
    </tbody>
  </table>

Corrections.propTypes = {
  corrections: T.array
}