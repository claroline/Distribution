import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {t, trans} from '#/main/core/translation'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

import {select} from '../../selectors'
import {actions} from '../actions'

class Drops extends Component {
  generateColumns() {
    const columns = []

    columns.push({
      name: 'dropzone',
      label: t('resource'),
      displayed: false,
      displayable: false,
      filterable: true,
      type: 'string'
    })
    columns.push({
      name: 'dropDate',
      label: trans('drop_date', {}, 'dropzone'),
      displayed: true,
      displayable: true,
      filterable: true,
      type: 'date',
      renderer: (rowData) => <a href={`#/drop/${rowData.id}`}>{rowData.dropDate ? rowData.dropDate : 'no_date'}</a>
    })
    columns.push({
      name: 'user',
      label: t('user'),
      displayed: true,
      renderer: (rowData) => rowData.user ? `${rowData.user.firstName} ${rowData.user.lastName}` : '-'
    })

    return columns
  }

  render() {
    return (
      <DataList
        name="drops"
        definition={this.generateColumns()}
        filterColumns={true}
        actions={[]}
        card={(row) => ({
          onClick: `#/drop/${row.id}/view`,
          poster: null,
          icon: null,
          title: '',
          subtitle: '',
          contentText: '',
          flags: [].filter(flag => !!flag),
          footer:
            <span></span>,
          footerLong:
            <span></span>
        })}
      />
    )
  }
}

Drops.propTypes = {
  drops: T.object
}

function mapStateToProps(state) {
  return {
    drops: select.drops(state)
  }
}

function mapDispatchToProps() {
  return {}
}

const ConnectedDrops = connect(mapStateToProps, mapDispatchToProps)(Drops)

export {ConnectedDrops as Drops}