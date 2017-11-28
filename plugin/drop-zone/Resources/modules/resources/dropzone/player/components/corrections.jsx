import React from 'react'
import {PropTypes as T} from 'prop-types'

import {t, trans} from '#/main/core/translation'

export const Corrections = props =>
  <table className="table corrections-table">
    <thead>
      <tr>
        <th></th>
        <th></th>
        <th>{t('start_date')}</th>
        <th>{t('end_date')}</th>
        <th>{t('score')}</th>
      </tr>
    </thead>
    <tbody>
    {props.corrections.filter(c => c.finished).map((c, idx) =>
      <tr key={`correction-row-${c.id}`}>
        <td>
          {c.correctionDenied &&
            <span className="fa fa-w fa-exclamation-triangle"/>
          }
        </td>
        <td>
          <a
            className="pointer-hand"
            onClick={() => {
              props.showModal(
                'MODAL_CORRECTION',
                {
                  title: trans('correction', {}, 'dropzone'),
                  correction: c,
                  dropzone: props.dropzone,
                  saveCorrection: (correction) => props.saveCorrection(correction)
                }
              )
            }}
          >
            {trans('correction_n', {number: idx + 1}, 'dropzone')}
          </a>
        </td>
        <td>{c.startDate}</td>
        <td>{c.endDate}</td>
        <td>{c.totalGrade}</td>
      </tr>
    )}
    </tbody>
  </table>

Corrections.propTypes = {
  dropzone: T.object,
  corrections: T.array,
  saveCorrection: T.func,
  showModal: T.func
}