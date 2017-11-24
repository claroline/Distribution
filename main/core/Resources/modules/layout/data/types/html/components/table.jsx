import React from 'react'

import {DataCell as DataCellTypes} from '#/main/core/layout/data/prop-types'

import {getPlainText} from '#/main/core/layout/data/types/html/utils'

const HtmlCell = props => getPlainText(props.data)

HtmlCell.propTypes = DataCellTypes.propTypes

export {
  HtmlCell
}
