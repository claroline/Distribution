import React from 'react'

import {DataCell as DataCellTypes} from '#/main/core/layout/data/prop-types'

import {TableCell} from '#/main/core/layout/table/components/table.jsx'
import {getPlainText} from '#/main/core/layout/data/types/html/utils'

const HtmlCell = props =>
  <TableCell className="html-cell">
    {getPlainText(props.data)}
  </TableCell>

HtmlCell.propTypes = DataCellTypes.propTypes

export {
  HtmlCell
}
