import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'

export const Corrections = props =>
  <table className="table corrections-table">
    <thead>
      <tr>
        <th></th>
        <th></th>
        <th>{trans('start_date', {}, 'dropzone')}</th>
        <th>{trans('end_date', {}, 'dropzone')}</th>
        <th>{trans('score', {}, 'dropzone')}</th>
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
            {trans('correction_n', {'%n%': idx}, 'dropzone')}
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