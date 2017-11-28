import React from 'react'
import {PropTypes as T} from 'prop-types'
import {t, trans} from '#/main/core/translation'

import {CorrectionRow} from '#/plugin/drop-zone/resources/dropzone/correction/components/correction-row.jsx'

export const Corrections = props =>
  <table className="table corrections-table">
    <thead>
      <tr>
        <th></th>
        <th>{trans('corrector', {}, 'dropzone')}</th>
        <th>{t('start_date')}</th>
        <th>{t('end_date')}</th>
        <th>{t('score')}</th>
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