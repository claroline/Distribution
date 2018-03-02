import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import merge from 'lodash/merge'

import {getTypeOrDefault} from '#/main/core/data/index'

import {Table} from '#/main/core/layout/table/components/table'
import {Button} from '#/main/core/layout/button/components/button'

const RowDataCell = props => {

  const typeDef = getTypeOrDefault(props.type)
  const cellData = get(props.data, props.name)

  let cellRendering
  if (props.renderer) {
    cellRendering = props.renderer(cellData)
  } else if (typeDef.components && typeDef.components.table) {
    // use custom component defined in the type definition
    cellRendering = React.createElement(typeDef.components.table, merge({data: cellData}, props.options || {}))
  } else {
    // use render defined in the type definition
    cellRendering = typeDef.render(cellData, props.options || {})
  }

  return <td>{cellRendering}</td>
}

const ComparisonTable = props =>
  <Table>

    {props.title && <thead>
    <tr>
      <th />
      {props.data.map((elem, index) => <th key={index}>{props.title(elem)}</th>)}
    </tr>
    </thead>}

    {props.action && <tfoot>
    <tr>
      <td />
      {props.data.map((elem, index) =>
        <td key={index}>
          <Button
            onClick={() => props.action.action(elem, props.data)}
            disabled={props.action.disabled(elem)}>
            {props.action.text(elem)}
          </Button>
        </td>)}
    </tr>
    </tfoot>}

    <tbody>
    {props.rows.map((elem, index) =>

        <tr key={index}>

          <td>{elem.label}</td>

          {props.data.map((data, index) =>
            <RowDataCell
              key={index}
              data={data}
              type={elem.type}
              name={elem.name}
              renderer={elem.renderer}
              options={elem.options} />
          )}
        </tr>
    )}
    </tbody>

  </Table>

ComparisonTable.propTypes = {
  data: T.array.isRequired,
  rows: T.arrayOf(T.shape({
    name: T.string.isRequired,
    label: T.string.isRequired,
    type: T.string.isRequired
  })).isRequired,
  action: T.shape({
    text: T.func.isRequired,
    action: T.func.isRequired,
    disabled: T.func
  }),
  title: T.func.isRequired
}

export {
  ComparisonTable
}

